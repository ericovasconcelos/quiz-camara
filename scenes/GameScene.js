import { COLORS, VISUAL_CONFIG, GAME_CONFIG } from '../constants.js';
import { ParticleManager } from '../utils/ParticleManager.js';
import { GameSession } from '../domain/GameSession.js';
import { QuestionRepository } from '../infrastructure/QuestionRepository.js';

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

        // 4. Timer Bar (Estilizada com Glow)
        const barY = 135;
        this.timerBarBg = this.add.graphics();
        this.timerBarBg.fillStyle(COLORS.primaryDark, 0.5);
        this.timerBarBg.fillRoundedRect(width / 2 - (width - 80) / 2, barY, width - 80, 10, 5);

        this.timerBar = this.add.graphics();
        this.timerBarWidth = width - 80;
        this.timerBarY = barY;

        // 5. Pergunta Card
        const qY = 170;
        this.questionText = this.add.text(width / 2, 260, '', {
            fontSize: '22px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: width - 100 },
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: '600',
            lineSpacing: 8
        }).setOrigin(0.5).setShadow(0, 2, 'rgba(0,0,0,0.5)', 2);

        // 6. Botões de Alternativas (Sistema Renovado)
        this.optionButtons = [];
        const startY = 380;
        const gapY = 100; // Mais espaço
        const btnWidth = width - 100;
        const btnHeight = 70;

        for (let i = 0; i < 4; i++) {
            const y = startY + (i * gapY);

            const btnContainer = this.add.container(width / 2, y);
            btnContainer.setSize(btnWidth, btnHeight);
            btnContainer.setInteractive({ useHandCursor: true });

            // Sombra
            const shadow = this.add.graphics();
            shadow.fillStyle(0x000000, 0.3);
            shadow.fillRoundedRect(-btnWidth / 2 + 4, -btnHeight / 2 + 4, btnWidth, btnHeight, VISUAL_CONFIG.borderRadius);

            // Fundo
            const bg = this.add.graphics();

            // Borda Glow (inicialmente invisível)
            const border = this.add.graphics();

            // Letra (Badge)
            const letters = ['A', 'B', 'C', 'D'];
            const badge = this.add.graphics();
            badge.fillStyle(COLORS.primaryDark, 0.5);
            badge.fillRoundedRect(-btnWidth / 2 + 10, -18, 36, 36, 12);

            const letter = this.add.text(-btnWidth / 2 + 28, 0, letters[i], {
                fontSize: '20px',
                fill: COLORS.accent,
                fontFamily: VISUAL_CONFIG.fontFamily,
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Texto da Alternativa
            const txt = this.add.text(-btnWidth / 2 + 65, 0, '', {
                fontSize: '18px',
                fill: COLORS.textLight,
                fontFamily: VISUAL_CONFIG.fontFamily,
                wordWrap: { width: btnWidth - 90 }
            }).setOrigin(0, 0.5);

            btnContainer.add([shadow, bg, border, badge, letter, txt]);

            // Guardar referências
            btnContainer.idx = i;
            btnContainer.bg = bg;
            btnContainer.border = border;
            btnContainer.txt = txt;
            btnContainer.badge = badge;
            btnContainer.letterText = letter;

            // Eventos
            btnContainer.on('pointerover', () => {
                if (!this.isProcessing) {
                    this.tweens.add({
                        targets: btnContainer,
                        scaleX: 1.02,
                        scaleY: 1.02,
                        duration: 200,
                        ease: 'Back.easeOut'
                    });

                    bg.clear();
                    bg.fillStyle(COLORS.primaryLight, 1);
                    bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, VISUAL_CONFIG.borderRadius);

                    // Glow border
                    border.clear();
                    border.lineStyle(2, COLORS.accent, 0.8);
                    border.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, VISUAL_CONFIG.borderRadius);

                    // Highlight text
                    txt.setColor('#ffffff');
                    letter.setColor('#ffffff');
                }
            });

            btnContainer.on('pointerout', () => {
                if (!this.isProcessing) {
                    this.tweens.add({
                        targets: btnContainer,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 200,
                        ease: 'Back.easeIn'
                    });

                    this.resetButtonStyle(btnContainer);
                }
            });

            btnContainer.on('pointerdown', () => this.checkAnswer(i));

            this.optionButtons.push(btnContainer);
        }

        // 7. Timer Logic
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        });

        // 8. Painel de Explicação (Moderno)
        this.createExplanationPanel(width, height);

        this.loadQuestion();

    }

    resetButtonStyle(btnContainer) {
        const width = this.cameras.main.width - 100;
        const height = 70;

        btnContainer.bg.clear();
        btnContainer.bg.fillStyle(COLORS.cardBg, 1);
        btnContainer.bg.fillRoundedRect(-width / 2, -height / 2, width, height, VISUAL_CONFIG.borderRadius);

        btnContainer.border.clear(); // Remove borda

        btnContainer.txt.setColor(COLORS.textLight ? '#ffffff' : '#ecf0f1');
        btnContainer.letterText.setColor(COLORS.accent ? '#d4af37' : '#d4af37');
    }

    createExplanationPanel(width, height) {
        this.explanationPanel = this.add.container(width / 2, height + 300);

        // Fundo com blur simulado (escuro semi-transparente) e borda
        const bg = this.add.graphics();
        const pWidth = width - 40;
        const pHeight = 250; // A bit taller for more space

        // Sombra massiva
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.5);
        shadow.fillRoundedRect(-pWidth / 2 + 10, -pHeight / 2 + 10, pWidth, pHeight, 20);

        bg.fillStyle(COLORS.cardBg, 0.98);
        bg.fillRoundedRect(-pWidth / 2, -pHeight / 2, pWidth, pHeight, 20);
        bg.lineStyle(2, COLORS.accent, 1);
        bg.strokeRoundedRect(-pWidth / 2, -pHeight / 2, pWidth, pHeight, 20);

        // Ícone de Status (Check ou X)
        this.explanationIcon = this.add.text(0, -pHeight / 2 + 40, '', {
            fontSize: '40px'
        }).setOrigin(0.5);

        // Título
        this.explanationTitle = this.add.text(0, -pHeight / 2 + 80, '', {
            fontSize: '24px',
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.explanationText = this.add.text(0, 20, '', {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: pWidth - 60 },
            fontFamily: VISUAL_CONFIG.fontFamily,
            lineSpacing: 6
        }).setOrigin(0.5);

        // Botão "Próximo" (visual)
        const nextText = this.add.text(0, pHeight / 2 - 30, 'Toque para continuar...', {
            fontSize: '14px',
            fill: COLORS.textDim,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Tween de "piscar" no texto
        this.tweens.add({
            targets: nextText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.explanationPanel.add([shadow, bg, this.explanationIcon, this.explanationTitle, this.explanationText, nextText]);
        this.explanationPanel.setDepth(100);

        // Make interactive
        bg.setInteractive(new Phaser.Geom.Rectangle(-pWidth / 2, -pHeight / 2, pWidth, pHeight), Phaser.Geom.Rectangle.Contains);
        bg.on('pointerdown', () => {
            this.handleNextClick();
        });
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

        // Reset UI
        // this.resetButtonStyle(this.option1); 

        this.questionText.setText(question.enunciado);
        this.questionText.setAlpha(0);
        this.tweens.add({ targets: this.questionText, alpha: 1, duration: 500 });

        this.progressText.setText(`${this.gameSession.currentIndex + 1} / ${this.questionCount}`);

        // Update Alternatives
        for (let i = 0; i < 4; i++) {
            const btn = this.optionButtons[i];
            btn.txt.setText(question.alternativas[i]);
            this.resetButtonStyle(btn);

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
        this.updateTimerBar(1); // Full bar

        this.timerEvent.paused = false;

        // Hide explanation panel
        this.explanationPanel.y = this.cameras.main.height + 300;
    }

    updateTimerBar(percentage) {
        this.timerBar.clear();

        // Cor dinâmica
        let color = COLORS.success;
        if (percentage < 0.3) color = COLORS.error;
        else if (percentage < 0.6) color = COLORS.warning;

        this.timerBar.fillStyle(color, 1);
        this.timerBar.fillRoundedRect(
            (this.cameras.main.width - this.timerBarWidth) / 2,
            this.timerBarY,
            this.timerBarWidth * percentage,
            10,
            5
        );

        // Glow se estiver acabando
        if (percentage < 0.3 && !this.timerBar.glowFx) {
            // this.timerBar.glowFx = this.timerBar.postFX.addGlow(COLORS.error, 1, 0, false, 0.1, 10);
        } else if (percentage >= 0.3 && this.timerBar.glowFx) {
            // this.timerBar.postFX.remove(this.timerBar.glowFx);
            // this.timerBar.glowFx = null;
        }
    }

    onTimerTick() {
        if (this.isProcessing) return;

        const isTimeout = this.gameSession.tick(1);

        this.timerText.setText(Math.ceil(this.gameSession.timeLeft).toString());

        const percentage = Math.max(0, this.gameSession.timeLeft / this.gameSession.config.timePerQuestion);
        this.updateTimerBar(percentage);

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
        this.highlightCorrect(result.correctIndex);

        this.showExplanation(result.explanation, false, true);
    }

    highlightCorrect(index) {
        const btn = this.optionButtons[index];
        const width = this.cameras.main.width - 100;
        const height = 70;

        btn.bg.clear();
        btn.bg.fillStyle(COLORS.success, 1);
        btn.bg.fillRoundedRect(-width / 2, -height / 2, width, height, VISUAL_CONFIG.borderRadius);

        btn.border.clear();
        btn.border.lineStyle(3, COLORS.successGlow || 0x2ecc71, 1);
        btn.border.strokeRoundedRect(-width / 2, -height / 2, width, height, VISUAL_CONFIG.borderRadius);
    }

    highlightWrong(index) {
        const btn = this.optionButtons[index];
        const width = this.cameras.main.width - 100;
        const height = 70;

        btn.bg.clear();
        btn.bg.fillStyle(COLORS.error, 1);
        btn.bg.fillRoundedRect(-width / 2, -height / 2, width, height, VISUAL_CONFIG.borderRadius);

        btn.border.clear();
        btn.border.lineStyle(3, COLORS.errorGlow || 0xe74c3c, 1);
        btn.border.strokeRoundedRect(-width / 2, -height / 2, width, height, VISUAL_CONFIG.borderRadius);
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

            this.highlightCorrect(selectedIndex);

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
            this.highlightWrong(selectedIndex);
            this.highlightCorrect(result.correctIndex); // Mostra qual era a certa

            // Shake
            this.cameras.main.shake(300, 0.01);

            // Partículas de erro (vermelhas)
            this.particles.emit(selectedBtn.x, selectedBtn.y, COLORS.error, 20, 'circle');

            this.showExplanation(result.explanation, false);
        }
    }

    showExplanation(text, wasCorrect, isTimeout = false) {
        const title = isTimeout ? '⏰ TEMPO ESGOTADO' : (wasCorrect ? 'CORRETO!' : 'INCORRETO');
        const color = isTimeout ? COLORS.warning : (wasCorrect ? COLORS.success : COLORS.error);
        const icon = isTimeout ? '⏳' : (wasCorrect ? '✅' : '❌');

        this.explanationTitle.setText(title);
        this.explanationTitle.setColor(wasCorrect ? '#2ecc71' : (isTimeout ? '#f39c12' : '#e74c3c'));

        this.explanationIcon.setText(icon);
        this.explanationText.setText(text);

        // Anima entrada
        this.tweens.add({
            targets: this.explanationPanel,
            y: this.cameras.main.height - 125, // Centered vertically in 250px panel
            duration: 600,
            ease: 'Back.easeOut'
        });

        // Se acertou, solta mais confete
        if (wasCorrect) {
            this.particles.emit(this.cameras.main.width / 2, this.cameras.main.height - 300, COLORS.accent, 20);
        }

        if (this.explanationTimer) this.explanationTimer.remove();
        this.explanationTimer = this.time.delayedCall(GAME_CONFIG.explanationDisplayTime || 3000, this.nextQuestion, [], this);
    }

    nextQuestion() {
        // Anima saída
        this.tweens.add({
            targets: this.explanationPanel,
            y: this.cameras.main.height + 300,
            duration: 500,
            ease: 'Back.easeIn'
        });

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
