import { COLORS, VISUAL_CONFIG, GAME_CONFIG } from '../constants.js';
import { ParticleManager } from '../utils/ParticleManager.js';
import { GameSession } from '../domain/GameSession.js';
import { QuestionRepository } from '../infrastructure/QuestionRepository.js';
import { TimerBar } from './ui/TimerBar.js';
import { AlternativeButton } from './ui/AlternativeButton.js';
import { ExplanationPanel } from './ui/ExplanationPanel.js';

// --- CENA DO JOGO ---
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        // Receives config from Menu (e.g., question count)
        this.questionCount = data.questionCount || 10;

        // Custom Questions from Menu
        const customQuestions = data.questions || null;

        // Initialize Domain Session
        this.gameSession = new GameSession();
        // Pass custom questions to Repository (it handles null by fallback to global)
        this.repository = new QuestionRepository(customQuestions);

        // UI Variables (Visual only)
        this.isProcessing = false;

        // Timer Event reference
        this.timerEvent = null;
    }

    create() {
        // Initialize Game Session
        const questions = this.repository.getRandomQuestions(this.questionCount);
        this.gameSession.start(questions, {
            timePerQuestion: GAME_CONFIG.timePerQuestion
        });

        const { width, height } = this.cameras.main;

        // 1. Background Gradient
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(COLORS.background, COLORS.background, COLORS.backgroundBottom, COLORS.backgroundBottom, 1);
        graphics.fillRect(0, 0, width, height);

        // 2. Ambient Particles
        this.particles = new ParticleManager(this);
        this.particles.createAmbient();

        // 3. Header
        this.createHeader(width);

        // 4. Timer Bar (Component)
        const barY = 135;
        this.timerBar = new TimerBar(this, width / 2 - (width - 80) / 2, barY, width - 80);

        // 5. Pergunta Card
        this.createQuestionText(width);

        // 6. Botões de Alternativas (Components)
        this.createOptionButtons(width);

        // 7. Timer Logic
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        });

        // 8. Painel de Explicação (Component)
        this.explanationPanel = new ExplanationPanel(this, width, height, () => this.handleNextClick());

        this.loadQuestion();
    }

    createHeader(width) {
        // Container do header com sombra e card style
        const headerY = 60;
        const headerBg = this.add.graphics();
        headerBg.fillStyle(COLORS.cardBg, 1);
        headerBg.fillRoundedRect(20, 20, width - 40, 90, VISUAL_CONFIG.borderRadius);

        // Sombra Header
        const headerShadow = this.add.graphics();
        headerShadow.fillStyle(0x000000, 0.2);
        headerShadow.fillRoundedRect(24, 24, width - 40, 90, VISUAL_CONFIG.borderRadius);
        headerShadow.setDepth(-1);

        // Score
        this.scoreText = this.add.text(50, headerY, 'Pontos: 0', {
            fontSize: '22px',
            fill: COLORS.accent,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: '600'
        }).setOrigin(0, 0.5);

        // Progress
        this.progressText = this.add.text(width / 2, headerY, '', {
            fontSize: '18px',
            fill: COLORS.textDim,
            fontFamily: VISUAL_CONFIG.fontFamily
        }).setOrigin(0.5);

        // Timer Text
        const timerX = width - 50;
        this.timerText = this.add.text(timerX, headerY, '20', {
            fontSize: '26px',
            fill: COLORS.textLight,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(1, 0.5);
    }

    createQuestionText(width) {
        this.questionText = this.add.text(width / 2, 260, '', {
            fontSize: '22px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: width - 100 },
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: '600',
            lineSpacing: 8
        }).setOrigin(0.5).setShadow(0, 2, 'rgba(0,0,0,0.5)', 2);
    }

    createOptionButtons(width) {
        this.optionButtons = [];
        const startY = 380;
        const gapY = 100;
        const btnWidth = width - 100;
        const btnHeight = 70;
        const letters = ['A', 'B', 'C', 'D'];

        for (let i = 0; i < 4; i++) {
            const y = startY + (i * gapY);

            const btn = new AlternativeButton(this, width / 2, y, btnWidth, btnHeight, i, '', letters[i]);

            btn.on('pointerdown', () => this.checkAnswer(i));

            this.optionButtons.push(btn);
        }
    }

    handleNextClick() {
        if (this.explanationTimer) {
            this.explanationTimer.remove();
            this.explanationTimer = null;
            this.nextQuestion();
        }
    }

    loadQuestion() {
        const question = this.gameSession.getCurrentQuestion();

        if (!question) {
            this.scene.start('ResultScene', {
                score: this.gameSession.score,
                total: this.questionCount,
                correctAnswers: this.gameSession.stats.correct
            });
            return;
        }

        this.isProcessing = false;

        this.questionText.setText(question.enunciado);
        this.questionText.setAlpha(0);
        this.tweens.add({ targets: this.questionText, alpha: 1, duration: 500 });

        this.progressText.setText(`${this.gameSession.currentIndex + 1} / ${this.questionCount}`);

        // Update Alternatives
        for (let i = 0; i < 4; i++) {
            const btn = this.optionButtons[i];
            btn.setText(question.alternativas[i]);
            btn.resetStyle();

            // Animação de entrada cascata
            btn.setAlpha(0);
            btn.x = this.cameras.main.width / 2 - 50;
            this.tweens.add({
                targets: btn,
                alpha: 1,
                x: this.cameras.main.width / 2,
                duration: 400,
                delay: i * 100,
                ease: 'Back.easeOut'
            });
        }

        // Reset Timer Visuals
        this.timerText.setText(this.gameSession.timeLeft.toString());
        this.timerText.setColor('#ffffff');
        this.timerBar.update(1); // Full bar

        this.timerEvent.paused = false;

        // Ensure explanation panel is hidden
        this.explanationPanel.y = this.cameras.main.height + 300;
    }

    onTimerTick() {
        if (this.isProcessing) return;

        const isTimeout = this.gameSession.tick(1);

        this.timerText.setText(Math.ceil(this.gameSession.timeLeft).toString());

        const percentage = Math.max(0, this.gameSession.timeLeft / this.gameSession.config.timePerQuestion);
        this.timerBar.update(percentage);

        // Efeitos de urgência
        if (this.gameSession.timeLeft <= 5) {
            this.timerText.setColor(COLORS.errorGlow ? '#e74c3c' : '#ff0000');
            this.tweens.add({
                targets: this.timerText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 100,
                yoyo: true
            });
        }

        if (isTimeout) {
            this.handleTimeout();
        }
    }

    handleTimeout() {
        this.isProcessing = true;
        this.timerEvent.paused = true;

        const result = this.gameSession.handleTimeout();

        // Mostra a correta
        this.optionButtons[result.correctIndex].highlightCorrect();

        this.showExplanation(result.explanation, false, true);
    }

    checkAnswer(selectedIndex) {
        if (this.isProcessing) return;

        this.isProcessing = true;
        this.timerEvent.paused = true;

        const selectedBtn = this.optionButtons[selectedIndex];

        // Animação de clique
        this.tweens.add({
            targets: selectedBtn,
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 100,
            yoyo: true
        });

        const result = this.gameSession.submitAnswer(selectedIndex);

        if (result.isCorrect) {
            // ACERTO
            this.scoreText.setText('Pontos: ' + this.gameSession.score);
            selectedBtn.highlightCorrect();

            // Partículas
            this.particles.emit(selectedBtn.x, selectedBtn.y, COLORS.success, 30, 'star');

            // Som/Feedback
            this.tweens.add({
                targets: this.scoreText,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 200,
                yoyo: true
            });

            this.showExplanation(result.explanation, true);
        } else {
            // ERRO
            selectedBtn.highlightWrong();
            this.optionButtons[result.correctIndex].highlightCorrect(); // Mostra qual era a certa

            // Shake
            this.cameras.main.shake(300, 0.01);

            // Partículas de erro (vermelhas)
            this.particles.emit(selectedBtn.x, selectedBtn.y, COLORS.error, 20, 'circle');

            this.showExplanation(result.explanation, false);
        }
    }

    showExplanation(text, wasCorrect, isTimeout = false) {
        this.explanationPanel.show(text, wasCorrect, isTimeout);

        // Se acertou, solta mais confete
        if (wasCorrect) {
            this.particles.emit(this.cameras.main.width / 2, this.cameras.main.height - 300, COLORS.accent, 20);
        }

        if (this.explanationTimer) this.explanationTimer.remove();
        this.explanationTimer = this.time.delayedCall(GAME_CONFIG.explanationDisplayTime || 3000, this.nextQuestion, [], this);
    }

    nextQuestion() {
        this.explanationPanel.hide();

        this.time.delayedCall(400, () => {
            const hasNext = this.gameSession.nextQuestion();

            if (hasNext) {
                // Fade transition
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.loadQuestion();
                    this.cameras.main.fadeIn(300, 0, 0, 0);
                });
            } else {
                this.cameras.main.fadeOut(800, 0, 0, 0);
                this.time.delayedCall(800, () => {
                    this.scene.start('ResultScene', {
                        score: this.gameSession.score,
                        total: this.questionCount,
                        correctAnswers: this.gameSession.stats.correct
                    });
                });
            }
        });
    }
}
