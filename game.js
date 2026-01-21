// ============================================
// QUIZ CÂMARA DOS DEPUTADOS - PHASER 3
// ============================================

// --- CONFIGURAÇÕES E CONSTANTES ---
// --- CONFIGURAÇÕES VISUAIS E CONSTANTES ---
const COLORS = {
    // Tema Jurídico/Legislativo (Azul Profundo & Dourado)
    primary: 0x1a3a52,      // Azul Institucional Profundo
    primaryLight: 0x2d5f8d, // Azul Mais Claro para Hover
    primaryDark: 0x0f1c2e,  // Azul Quase Preto para Sombras

    accent: 0xd4af37,       // Dourado Clássico
    accentLight: 0xf5c542,  // Dourado Brilhante
    accentDark: 0x8a7018,   // Dourado Escuro/Bronze

    background: 0x141e30,   // Azul Noturno (Top Gradient)
    backgroundBottom: 0x243b55, // Azul Crepúsculo (Bottom Gradient)

    cardBg: 0x1e2e42,       // Azul Card
    cardBorder: 0x3b5270,   // Borda Suave

    success: 0x27ae60,      // Verde Sucesso
    successGlow: 0x2ecc71,

    error: 0xc0392b,        // Vermelho Erro
    errorGlow: 0xe74c3c,

    warning: 0xf39c12,      // Laranja Alerta

    textLight: 0xffffff,
    textDim: 0xaab7c4,
    textGold: 0xe6c870
};

const VISUAL_CONFIG = {
    fontFamily: '"Poppins", "Segoe UI", Tahoma, sans-serif',
    borderRadius: 16,
    shadowAlpha: 0.4,
    glowAlpha: 0.6,
    particleCount: 50, // Mobile friendly default
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
};

// Ajuste para mobile
if (VISUAL_CONFIG.isMobile) {
    VISUAL_CONFIG.particleCount = 25;
}

const GAME_CONFIG = {
    questionsPerGame: 10,
    timePerQuestion: 20,
    explanationDisplayTime: 4000
};

// --- UTILITÁRIOS ---
class ParticleManager {
    constructor(scene) {
        this.scene = scene;
        this.pool = [];
    }

    emit(x, y, color, count = 10, type = 'star') {
        const actualCount = Math.min(count, VISUAL_CONFIG.particleCount);

        for (let i = 0; i < actualCount; i++) {
            let particle = this.getParticle();
            if (!particle) {
                // Criar nova partícula se pool estiver vazia
                if (type === 'circle') {
                    particle = this.scene.add.circle(0, 0, 4, color);
                } else {
                    particle = this.scene.add.rectangle(0, 0, 6, 6, color);
                }
            }

            particle.setActive(true).setVisible(true);
            particle.x = x;
            particle.y = y;
            particle.setFillStyle(color);
            particle.alpha = 1;
            particle.scale = 1;

            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 150;
            const duration = 600 + Math.random() * 600;

            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0,
                rotation: Math.random() * 4,
                duration: duration,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.returnParticle(particle);
                }
            });
        }
    }

    createAmbient(count = 20) {
        if (VISUAL_CONFIG.isMobile && count > 10) count = 10;

        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.scene.cameras.main.width;
            const y = Math.random() * this.scene.cameras.main.height;
            const size = 2 + Math.random() * 3;
            const p = this.scene.add.circle(x, y, size, 0xffffff, 0.1 + Math.random() * 0.2);

            this.scene.tweens.add({
                targets: p,
                y: y - 50 - Math.random() * 50,
                alpha: { from: p.alpha, to: 0 },
                duration: 3000 + Math.random() * 4000,
                repeat: -1,
                onRepeat: () => {
                    p.x = Math.random() * this.scene.cameras.main.width;
                    p.y = this.scene.cameras.main.height + 10;
                    p.alpha = 0.1 + Math.random() * 0.2;
                }
            });
        }
    }

    getParticle() {
        return this.pool.pop();
    }

    returnParticle(particle) {
        particle.setActive(false).setVisible(false);
        this.pool.push(particle);
    }
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getHighScore() {
    return parseInt(localStorage.getItem('quizCamaraHighScore') || '0');
}

function saveHighScore(score) {
    localStorage.setItem('quizCamaraHighScore', score.toString());
}

// --- CENA DO MENU ---
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // 1. Background Gradient Moderno
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(COLORS.background, COLORS.background, COLORS.backgroundBottom, COLORS.backgroundBottom, 1);
        graphics.fillRect(0, 0, width, height);

        // 2. Ambient Particles
        this.particles = new ParticleManager(this);
        this.particles.createAmbient();

        // 3. Brasão/Logo Estilizado
        // Círculo base com glow
        const logoBg = this.add.circle(width / 2, 140, 50, COLORS.primary);
        logoBg.setStrokeStyle(2, COLORS.accent);
        logoBg.postFX.addGlow(COLORS.accent, 0.5, 0, false, 0.1, 10);

        // Logo text/icon placeholder
        this.add.text(width / 2, 140, '🏛️', { fontSize: '48px' }).setOrigin(0.5);

        // 4. Título com Sombra e Gradiente Visual
        const titleY = 300;

        const titleShadow = this.add.text(width / 2 + 2, titleY + 2, 'QUIZ', {
            fontSize: '64px',
            fill: '#000000',
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.3);

        const title = this.add.text(width / 2, titleY, 'QUIZ', {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Subtítulo Dourado
        this.add.text(width / 2, titleY + 60, 'CÂMARA DOS DEPUTADOS', {
            fontSize: '32px',
            fill: '#d4af37',
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: '600'
        }).setOrigin(0.5).setShadow(0, 2, 'rgba(0,0,0,0.5)', 4);

        // Custom Quiz Check
        const currentQuizId = localStorage.getItem('quizCamaraCurrentQuiz');
        let subtitleText = 'Direito Constitucional & Regimento Interno';

        if (currentQuizId) {
            const quizzes = JSON.parse(localStorage.getItem('quizCamaraQuizzes') || '[]');
            const customQuiz = quizzes.find(q => q.id === currentQuizId);
            if (customQuiz) {
                subtitleText = `Modo Personalizado: ${customQuiz.title}`;
                localStorage.setItem('quizCamaraCurrentQuizTitle', customQuiz.title);
            } else {
                // ID exists but quiz not found? Default.
                localStorage.setItem('quizCamaraCurrentQuizTitle', 'Direito Constitucional & Regimento Interno');
            }
        } else {
            localStorage.setItem('quizCamaraCurrentQuizTitle', 'Direito Constitucional & Regimento Interno');
        }


        this.add.text(width / 2, titleY + 100, subtitleText, {
            fontSize: '16px',
            fill: '#aab7c4',
            fontFamily: VISUAL_CONFIG.fontFamily,
            letterSpacing: 1
        }).setOrigin(0.5);

        // 5. High Score Badge
        const highScore = getHighScore();
        if (highScore > 0) {
            const badgeY = 480;
            const badgeBg = this.add.graphics();
            badgeBg.fillStyle(0x000000, 0.3);
            badgeBg.fillRoundedRect(width / 2 - 100, badgeY - 20, 200, 40, 20);

            this.add.text(width / 2, badgeY, `🏆 Recorde: ${highScore}`, {
                fontSize: '18px',
                fill: '#f39c12',
                fontFamily: VISUAL_CONFIG.fontFamily,
                fontStyle: '600'
            }).setOrigin(0.5);
        }

        // 6. Botão Iniciar Moderno
        const btnY = 620;
        const btnWidth = 260;
        const btnHeight = 70;

        // Container do botão para animação conjunta
        const btnContainer = this.add.container(width / 2, btnY);
        btnContainer.setSize(btnWidth, btnHeight);
        btnContainer.setInteractive({ useHandCursor: true });

        // Sombra do botão
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.3);
        shadow.fillRoundedRect(-btnWidth / 2 + 4, -btnHeight / 2 + 4, btnWidth, btnHeight, VISUAL_CONFIG.borderRadius);

        // Fundo do botão
        const btnBg = this.add.graphics();
        btnBg.fillStyle(COLORS.success, 1);
        btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, VISUAL_CONFIG.borderRadius);

        // Brilho superior (highlight)
        const btnGlance = this.add.graphics();
        btnGlance.fillStyle(0xffffff, 0.1);
        btnGlance.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight / 2, { tl: VISUAL_CONFIG.borderRadius, tr: VISUAL_CONFIG.borderRadius, bl: 0, br: 0 });

        // Texto do botão
        const btnText = this.add.text(0, 0, 'INICIAR QUIZ', {
            fontSize: '26px',
            fill: '#ffffff',
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        btnContainer.add([shadow, btnBg, btnGlance, btnText]);

        // Interações
        btnContainer.on('pointerover', () => {
            this.tweens.add({
                targets: btnContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
            btnBg.clear();
            btnBg.fillStyle(COLORS.successGlow, 1);
            btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, VISUAL_CONFIG.borderRadius);

            // Efeito de glow externo
            if (!btnContainer.glowFx) {
                btnContainer.glowFx = btnContainer.postFX.addGlow(COLORS.successGlow, 0.5, 0, false, 0.1, 10);
            }
        });

        btnContainer.on('pointerout', () => {
            this.tweens.add({
                targets: btnContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
            btnBg.clear();
            btnBg.fillStyle(COLORS.success, 1);
            btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, VISUAL_CONFIG.borderRadius);

            if (btnContainer.glowFx) {
                btnContainer.postFX.remove(btnContainer.glowFx);
                btnContainer.glowFx = null;
            }
        });

        btnContainer.on('pointerdown', () => {
            this.tweens.add({
                targets: btnContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true
            });

            // Partículas de clique
            this.particles.emit(width / 2, btnY, COLORS.success, 15);

            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
            });
        });

        // 7. Info Rodapé
        this.add.text(width / 2, height - 30, `${QUESTION_BANK.length} questões disponíveis • Modo Rápido`, {
            fontSize: '14px',
            fill: COLORS.textDim,
            fontFamily: VISUAL_CONFIG.fontFamily
        }).setOrigin(0.5);

        // Transition In
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Animação inicial dos elementos
        title.y -= 50;
        title.alpha = 0;
        this.tweens.add({
            targets: title,
            y: titleY,
            alpha: 1,
            duration: 800,
            ease: 'Bounce.easeOut'
        });

        btnContainer.alpha = 0;
        btnContainer.y += 50;
        this.tweens.add({
            targets: btnContainer,
            y: btnY,
            alpha: 1,
            delay: 400,
            duration: 600,
            ease: 'Power2'
        });

        // 8. Botão Admin (Discrete)
        const adminBtn = this.add.text(width / 2, height - 60, '⚙️ Gerenciar Questões (Admin)', {
            fontSize: '14px',
            fill: '#576574',
            fontFamily: VISUAL_CONFIG.fontFamily
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        adminBtn.on('pointerover', () => adminBtn.setColor(COLORS.accent ? '#d4af37' : '#d4af37'));
        adminBtn.on('pointerout', () => adminBtn.setColor('#576574'));
        adminBtn.on('pointerdown', () => window.location.href = 'admin.html');

        // 9. Leaderboard Button (Top Right)
        const lbBtn = this.add.text(width - 40, 40, '🏆', { fontSize: '28px' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        lbBtn.on('pointerdown', () => this.showLeaderboard());
    }

    async showLeaderboard() {
        // Create Modal Container
        if (this.lbContainer) this.lbContainer.destroy();

        const { width, height } = this.cameras.main;
        const container = this.add.container(width / 2, height / 2);
        this.lbContainer = container;

        // Background Dim
        const bg = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setInteractive();
        bg.on('pointerdown', () => container.destroy()); // Click outside to close

        // Panel
        const panel = this.add.graphics();
        panel.fillStyle(COLORS.cardBg, 1);
        panel.fillRoundedRect(-300, -350, 600, 700, 20);
        panel.lineStyle(2, COLORS.accent, 1);
        panel.strokeRoundedRect(-300, -350, 600, 700, 20);

        const title = this.add.text(0, -300, 'RANKING GLOBAL', {
            fontSize: '32px',
            fill: COLORS.accent,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const loading = this.add.text(0, 0, 'Carregando...', { fontSize: '20px' }).setOrigin(0.5);

        container.add([bg, panel, title, loading]);

        try {
            const res = await fetch('/api/leaderboard');
            const data = await res.json();
            loading.destroy();

            if (data.length === 0) {
                container.add(this.add.text(0, 0, 'Ainda sem recordes!', { fontSize: '20px' }).setOrigin(0.5));
            } else {
                let y = -220;
                data.forEach((entry, index) => {
                    const color = index === 0 ? '#f1c40f' : (index === 1 ? '#bdc3c7' : (index === 2 ? '#cd7f32' : '#ffffff'));

                    const rank = this.add.text(-250, y, `#${index + 1}`, { fontSize: '20px', fill: color, fontFamily: VISUAL_CONFIG.fontFamily });
                    const name = this.add.text(-180, y, entry.playerName || 'Anônimo', { fontSize: '20px', fill: color, fontFamily: VISUAL_CONFIG.fontFamily });
                    const score = this.add.text(150, y, `${entry.score}/${entry.total}`, { fontSize: '20px', fill: color, fontFamily: VISUAL_CONFIG.fontFamily });
                    const percent = this.add.text(240, y, `${entry.percentage}%`, { fontSize: '16px', fill: '#95a5a6', fontFamily: VISUAL_CONFIG.fontFamily }).setOrigin(1, 0);

                    container.add([rank, name, score, percent]);
                    y += 50;
                });
            }
        } catch (e) {
            loading.setText('Erro ao carregar ranking');
        }

        container.setScale(0);
        this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 300, ease: 'Back.easeOut' });
    }
}

// --- CENA DO JOGO ---
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        // Load Questions - Check LocalStorage first
        let questionsToLoad = QUESTION_BANK;
        const currentQuizId = localStorage.getItem('quizCamaraCurrentQuiz');
        let isCustom = false;

        if (currentQuizId) {
            const quizzes = JSON.parse(localStorage.getItem('quizCamaraQuizzes') || '[]');
            const customQuiz = quizzes.find(q => q.id === currentQuizId);
            if (customQuiz && customQuiz.questions && customQuiz.questions.length > 0) {
                questionsToLoad = customQuiz.questions;
                isCustom = true;
            }
        }

        // Seleciona e embaralha perguntas
        const shuffledBank = shuffleArray(questionsToLoad);

        // Se for custom, usa todas (ou limita se quiser, mas geralmente custom o user quer todas)
        // Se for padrão, limita ao config
        const limit = isCustom ? Math.min(questionsToLoad.length, 50) : GAME_CONFIG.questionsPerGame;

        this.gameQuestions = shuffledBank.slice(0, limit);

        // Embaralha alternativas
        this.gameQuestions = this.gameQuestions.map(q => {
            const alternatives = q.alternativas.map((alt, idx) => ({ text: alt, isCorrect: idx === q.correta }));
            const shuffled = shuffleArray(alternatives);
            return {
                enunciado: q.enunciado,
                alternativas: shuffled.map(a => a.text),
                correta: shuffled.findIndex(a => a.isCorrect),
                explicacao: q.explicacao
            };
        });

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = GAME_CONFIG.timePerQuestion;
        this.isProcessing = false;
    }

    create() {
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
        this.cameras.main.fadeIn(500, 0, 0, 0);
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
    }

    loadQuestion() {
        const q = this.gameQuestions[this.currentQuestionIndex];

        this.questionText.setText(q.enunciado);
        this.questionText.setAlpha(0);
        this.tweens.add({ targets: this.questionText, alpha: 1, duration: 500 });

        this.progressText.setText(`${this.currentQuestionIndex + 1} / ${this.gameQuestions.length}`);

        for (let i = 0; i < 4; i++) {
            const btn = this.optionButtons[i];
            btn.txt.setText(q.alternativas[i]);
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

        this.timeLeft = GAME_CONFIG.timePerQuestion;
        this.timerText.setText(this.timeLeft.toString());
        this.timerText.setColor('#ffffff');

        // Reset Visual Timer Bar
        this.updateTimerBar(1);

        this.isProcessing = false;
        this.timerEvent.paused = false;

        // Esconde painel
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

        this.timeLeft--;
        this.timerText.setText(this.timeLeft.toString());

        const percentage = Math.max(0, this.timeLeft / GAME_CONFIG.timePerQuestion);
        this.updateTimerBar(percentage);

        // Efeitos de urgência
        if (this.timeLeft <= 5) {
            this.timerText.setColor(COLORS.errorGlow ? '#e74c3c' : '#ff0000');
            this.tweens.add({
                targets: this.timerText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 100,
                yoyo: true
            });
        }

        if (this.timeLeft <= 0) {
            this.handleTimeout();
        }
    }

    handleTimeout() {
        this.isProcessing = true;
        this.timerEvent.paused = true;
        const q = this.gameQuestions[this.currentQuestionIndex];

        // Mostra a correta
        this.highlightCorrect(q.correta);

        this.showExplanation(q.explicacao, false, true);
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

        const q = this.gameQuestions[this.currentQuestionIndex];
        const selectedBtn = this.optionButtons[selectedIndex];

        // Animação de clique
        this.tweens.add({
            targets: selectedBtn,
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 100,
            yoyo: true
        });

        if (selectedIndex === q.correta) {
            // ACERTO
            this.score++;
            this.scoreText.setText('Pontos: ' + this.score);

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

            this.showExplanation(q.explicacao, true);
        } else {
            // ERRO
            this.highlightWrong(selectedIndex);
            this.highlightCorrect(q.correta); // Mostra qual era a certa

            // Shake
            this.cameras.main.shake(300, 0.01);

            // Partículas de erro (vermelhas)
            this.particles.emit(selectedBtn.x, selectedBtn.y, COLORS.error, 20, 'circle');

            this.showExplanation(q.explicacao, false);
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

        this.time.delayedCall(GAME_CONFIG.explanationDisplayTime, this.nextQuestion, [], this);
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
            this.currentQuestionIndex++;

            if (this.currentQuestionIndex < this.gameQuestions.length) {
                // Fade transition
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.loadQuestion();
                    this.cameras.main.fadeIn(300, 0, 0, 0);
                });
            } else {
                this.cameras.main.fadeOut(800, 0, 0, 0);
                this.time.delayedCall(800, () => {
                    this.scene.start('ResultScene', { score: this.score, total: this.gameQuestions.length });
                });
            }
        });
    }
}

// --- CENA DE RESULTADO ---
class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScene' });
    }

    create(data) {
        const { width, height } = this.cameras.main;
        const { score, total } = data;
        const percentage = (score / total) * 100;

        // 1. Background
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(COLORS.background, COLORS.background, COLORS.backgroundBottom, COLORS.backgroundBottom, 1);
        graphics.fillRect(0, 0, width, height);

        // 2. Ambient Particles
        this.particles = new ParticleManager(this);
        this.particles.createAmbient();

        // 3. High Score logic
        const previousHigh = getHighScore();
        const isNewRecord = score > previousHigh;
        if (isNewRecord) {
            saveHighScore(score);
        }

        // 4. Container Principal
        const container = this.add.container(width / 2, height / 2);

        // Título "RESULTADO"
        const title = this.add.text(0, -220, 'RESULTADO', {
            fontSize: '42px',
            fill: '#ffffff',
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Score Card
        const cardWidth = 320;
        const cardHeight = 160;

        const cardShadow = this.add.graphics();
        cardShadow.fillStyle(0x000000, 0.3);
        cardShadow.fillRoundedRect(-cardWidth / 2 + 6, -130 + 6, cardWidth, cardHeight, 20);

        const cardBg = this.add.graphics();
        cardBg.fillStyle(COLORS.cardBg, 1);
        cardBg.fillRoundedRect(-cardWidth / 2, -130, cardWidth, cardHeight, 20);
        cardBg.lineStyle(2, COLORS.accent, 0.5);
        cardBg.strokeRoundedRect(-cardWidth / 2, -130, cardWidth, cardHeight, 20);

        // Pontuação Texto
        const scoreText = this.add.text(0, -80, `${score} / ${total}`, {
            fontSize: '56px',
            fill: COLORS.accent,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Efeito de Glow no Score
        scoreText.postFX.addGlow(COLORS.accent, 1, 0, false, 0.1, 10);

        const labelText = this.add.text(0, -30, 'ACERTOS', {
            fontSize: '18px',
            fill: COLORS.textDim,
            fontFamily: VISUAL_CONFIG.fontFamily,
            letterSpacing: 2
        }).setOrigin(0.5);

        container.add([title, cardShadow, cardBg, scoreText, labelText]);

        // 5. New Record Celebration
        if (isNewRecord && score > 0) {
            const recordText = this.add.text(0, 20, '🏆 NOVO RECORDE!', {
                fontSize: '28px',
                fill: '#f39c12',
                fontFamily: VISUAL_CONFIG.fontFamily,
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: recordText,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 400,
                yoyo: true,
                repeat: -1
            });

            // Fogos de artifício
            this.time.addEvent({
                delay: 500,
                repeat: 5,
                callback: () => {
                    const xr = (Math.random() - 0.5) * width;
                    const yr = (Math.random() - 0.5) * height;
                    this.particles.emit(width / 2 + xr, height / 2 + yr, 0xffffff, 40, 'circle');
                    this.cameras.main.shake(100, 0.002);
                }
            });

            container.add(recordText);
        }

        // 6. Mensagem de Feedback
        let msg = '';
        let msgColor = '#ecf0f1';
        let emoji = '';

        if (percentage === 100) {
            msg = 'PERFEITO! Você domina o conteúdo!';
            msgColor = COLORS.success;
            emoji = '🎯';
        } else if (percentage >= 80) {
            msg = 'Excelente! Você está muito bem preparado.';
            msgColor = COLORS.success;
            emoji = '⭐';
        } else if (percentage >= 60) {
            msg = 'Bom trabalho! Continue praticando.';
            msgColor = '#3498db';
            emoji = '👍';
        } else if (percentage >= 40) {
            msg = 'Estude mais um pouco e tente novamente.';
            msgColor = COLORS.warning;
            emoji = '📚';
        } else {
            msg = 'Precisa revisar o conteúdo.';
            msgColor = COLORS.error;
            emoji = '📖';
        }

        const feedbackText = this.add.text(0, 90, `${emoji}\n${msg}`, {
            fontSize: '20px',
            fill: msgColor,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: '600',
            align: 'center',
            wordWrap: { width: width - 80 }
        }).setOrigin(0.5);

        container.add(feedbackText);

        // 7. Botão Jogar Novamente (Mesmo estilo do Menu)
        const btnY = 280; // Was 200, moved down
        const btnWidth = 280;
        const btnHeight = 70;

        const btnContainer = this.add.container(0, btnY);
        btnContainer.setSize(btnWidth, btnHeight);
        btnContainer.setInteractive({ useHandCursor: true });

        const btnShadow = this.add.graphics();
        btnShadow.fillStyle(0x000000, 0.3);
        btnShadow.fillRoundedRect(-btnWidth / 2 + 4, -btnHeight / 2 + 4, btnWidth, btnHeight, VISUAL_CONFIG.borderRadius);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(COLORS.primary, 1);
        btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, VISUAL_CONFIG.borderRadius);

        const btnText = this.add.text(0, 0, 'JOGAR NOVAMENTE', {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        btnContainer.add([btnShadow, btnBg, btnText]);
        container.add(btnContainer);

        // Interações do Botão
        btnContainer.on('pointerover', () => {
            this.tweens.add({
                targets: btnContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
            btnBg.clear();
            btnBg.fillStyle(COLORS.primaryLight, 1);
            btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, VISUAL_CONFIG.borderRadius);
        });

        btnContainer.on('pointerout', () => {
            this.tweens.add({
                targets: btnContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
            btnBg.clear();
            btnBg.fillStyle(COLORS.primary, 1);
            btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, VISUAL_CONFIG.borderRadius);
        });

        btnContainer.on('pointerdown', () => {
            this.tweens.add({
                targets: btnContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true
            });

            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('MenuScene');
            });
        });

        // Rodapé Stats
        const footer = this.add.text(0, height / 2 - 40, `Recorde Atual: ${getHighScore()} pontos`, {
            fontSize: '14px',
            fill: COLORS.textDim,
            fontFamily: VISUAL_CONFIG.fontFamily
        }).setOrigin(0.5);
        container.add(footer);

        // Transition In (Pop Up do Container)
        container.scale = 0.8;
        container.alpha = 0;

        this.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 600,
            ease: 'Back.easeOut'
        });

        // Save Result to DB if Logged In
        const token = localStorage.getItem('netlify_token');
        if (token) {
            const resultData = {
                score: score,
                total: total,
                quizTitle: localStorage.getItem('quizCamaraCurrentQuizTitle') || 'Jogo Rápido',
                percentage: percentage
            };

            fetch('/api/history/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(resultData)
            }).catch(console.error);
        }

        this.time.addEvent({
            delay: 500,
            callback: () => this.cameras.main.fadeIn(500, 0, 0, 0)
        });
    }
}

// --- CONFIGURAÇÃO DO JOGO ---
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 850,
    backgroundColor: '#1e2838',
    parent: 'game-container',
    scene: [MenuScene, GameScene, ResultScene]
};

const game = new Phaser.Game(config);
