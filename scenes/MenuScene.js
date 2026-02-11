import { COLORS, VISUAL_CONFIG, STORAGE_KEY_HIGHSCORE } from '../constants.js';
import { ParticleManager } from '../utils/ParticleManager.js';
import { getAuthToken } from '../utils/helpers.js';
import { quizRepository } from '../infrastructure/QuizRepository.js';

// --- CENA DO MENU ---
export class MenuScene extends Phaser.Scene {
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

        // ... class MenuScene ...

        // Custom Quiz Check via Repository
        const currentQuiz = quizRepository.getSelectedQuiz();
        let subtitleText = 'Direito Constitucional & Regimento Interno';

        if (currentQuiz) {
            subtitleText = `Modo Personalizado: ${currentQuiz.title}`;
        }


        this.add.text(width / 2, titleY + 100, subtitleText, {
            fontSize: '16px',
            fill: '#aab7c4',
            fontFamily: VISUAL_CONFIG.fontFamily,
            letterSpacing: 1
        }).setOrigin(0.5);

        // 5. High Score Badge (Placeholder, will update async)
        const badgeY = 450;
        this.highScoreContainer = this.add.container(width / 2, badgeY);
        this.highScoreContainer.visible = false;

        const badgeBg = this.add.graphics();
        badgeBg.fillStyle(0x000000, 0.3);
        badgeBg.fillRoundedRect(-100, -20, 200, 40, 20);

        const badgeText = this.add.text(0, 0, 'Carregando Recorde...', {
            fontSize: '18px',
            fill: '#f39c12',
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.highScoreText = badgeText;

        this.highScoreContainer.add([badgeBg, badgeText]);

        // Check DB for High Score if logged in, else LocalStorage
        this.loadUserHighScore();

        // 6. Seletor de Quantidade de Questões
        // Calcular o total de questões disponíveis no quiz atual
        // Assuming QUESTION_BANK is globally available on window as set in questions.js
        let availableQuestionsCount = (window.QUESTION_BANK && window.QUESTION_BANK.length) || 0;

        if (currentQuiz && currentQuiz.questions) {
            availableQuestionsCount = currentQuiz.questions.length;
        }

        // Recuperar preferência do usuário ou definir padrão (10 ou total se for menor)
        let selectedCount = parseInt(localStorage.getItem('quizCamaraSelectedCount'));
        if (!selectedCount || isNaN(selectedCount)) selectedCount = Math.min(10, availableQuestionsCount);
        // Validar se a preferência salva não excede o total atual (caso troque de quiz)
        if (selectedCount > availableQuestionsCount) selectedCount = availableQuestionsCount;

        // Persistir (caso tenhamos ajustado)
        localStorage.setItem('quizCamaraSelectedCount', selectedCount);

        const selectorY = 540;

        // Label
        this.add.text(width / 2, selectorY - 35, 'QUANTIDADE DE QUESTÕES:', {
            fontSize: '14px',
            fill: '#aab7c4',
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: '600'
        }).setOrigin(0.5);

        // Container do Seletor
        const selectorContainer = this.add.container(width / 2, selectorY);

        // Background do contador
        const counterBg = this.add.graphics();
        counterBg.fillStyle(COLORS.cardBg, 1);
        counterBg.fillRoundedRect(-50, -20, 100, 40, 10);

        // Texto do contador
        const countText = this.add.text(0, 0, selectedCount.toString(), {
            fontSize: '24px', // Aumentei um pouco
            fill: '#ffffff',
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Função para atualizar texto e storage
        const updateCounter = (newCount) => {
            selectedCount = Phaser.Math.Clamp(newCount, 1, availableQuestionsCount);
            countText.setText(selectedCount.toString());
            localStorage.setItem('quizCamaraSelectedCount', selectedCount);
        };

        // Botão Menus (-)
        const btnMinus = this.add.text(-80, 0, '-', {
            fontSize: '32px',
            fill: COLORS.accent,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btnMinus.on('pointerdown', () => {
            updateCounter(selectedCount - 1);
            this.tweens.add({ targets: btnMinus, scale: 0.8, yoyo: true, duration: 50 });
        });

        // Botão Mais (+)
        const btnPlus = this.add.text(80, 0, '+', {
            fontSize: '32px',
            fill: COLORS.accent,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btnPlus.on('pointerdown', () => {
            updateCounter(selectedCount + 1);
            this.tweens.add({ targets: btnPlus, scale: 0.8, yoyo: true, duration: 50 });
        });

        // Botão MAX
        const btnMax = this.add.text(140, 0, 'MÁX', {
            fontSize: '14px',
            fill: COLORS.primaryLight,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Background do botão MAX para parecer um botãozinho
        const maxBg = this.add.graphics();
        maxBg.lineStyle(1, COLORS.primaryLight, 1);
        maxBg.strokeRoundedRect(115, -12, 50, 24, 6);
        selectorContainer.add(maxBg);

        btnMax.on('pointerdown', () => {
            updateCounter(availableQuestionsCount);
            this.tweens.add({ targets: [btnMax, maxBg], scale: 0.9, yoyo: true, duration: 50 });
        });

        // Adicionar tudo ao container
        selectorContainer.add([counterBg, countText, btnMinus, btnPlus, btnMax]);


        // 7. Botão Iniciar Moderno
        const btnY = 640; // Empurrei um pouco pra baixo
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
        const isLogged = !!window.netlifyIdentity.currentUser();
        const btnLabel = isLogged ? 'INICIAR QUIZ' : 'LOGIN PARA JOGAR'; // Fixed logic

        const btnText = this.add.text(0, 0, btnLabel, {
            fontSize: '24px',
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
            const user = window.netlifyIdentity.currentUser();
            if (!user) {
                // Enforce Login
                window.netlifyIdentity.open();
                return;
            }

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
                // Pass selectedCount AND custom questions to GameScene
                // Use Repository to get fresh data
                const currentQuiz = quizRepository.getSelectedQuiz();
                let customQuestions = null;

                if (currentQuiz && currentQuiz.questions && currentQuiz.questions.length > 0) {
                    customQuestions = currentQuiz.questions;
                    console.log("Starting Custom Quiz:", currentQuiz.title);
                }

                this.scene.start('GameScene', {
                    questionCount: selectedCount,
                    questions: customQuestions
                });
            });
        });

        // 8. Info Rodapé
        this.add.text(width / 2, height - 30, `${availableQuestionsCount} questões disponíveis • Modo Rápido`, {
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

        // 9. Leaderboard Button (Moved to Top Left to avoid Login overlap)
        const lbBtn = this.add.text(40, 40, '🏆', { fontSize: '28px' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        lbBtn.on('pointerdown', () => this.showLeaderboard());
    }

    async loadUserHighScore() {
        const token = await getAuthToken();
        let bestScore = 0;

        // Try API first
        if (token) {
            try {
                const res = await fetch('/api/history/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const history = await res.json();
                if (history && history.length > 0) {
                    // Find max score in current mode (optional filtering) or just global max
                    // For simplicity, showing global max score
                    const maxEntry = history.reduce((prev, current) => (prev.score > current.score) ? prev : current);
                    bestScore = maxEntry.score;
                }
            } catch (e) {
                console.error("Failed to fetch history", e);
            }
        }

        // Fallback to LocalStorage if API gave 0 (or error), AND if LocalStorage is higher
        const localScore = parseInt(localStorage.getItem(STORAGE_KEY_HIGHSCORE) || '0');
        if (localScore > bestScore) bestScore = localScore;

        if (bestScore > 0) {
            this.highScoreText.setText(`🏆 Recorde: ${bestScore}`);
            this.highScoreContainer.visible = true;
        }
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

        const title = this.add.text(0, -320, 'RANKING GLOBAL', {
            fontSize: '32px',
            fill: COLORS.accent,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        container.add([bg, panel, title]);

        // --- FILTERS UI ---
        this.currentFilter = { period: 'all_time', limit: 10 };

        // Tab Helper
        const createTab = (x, y, label, value, type) => {
            const tabText = this.add.text(x, y, label, {
                fontSize: '16px',
                fill: (this.currentFilter[type] === value) ? COLORS.accent : '#576574',
                fontFamily: VISUAL_CONFIG.fontFamily,
                fontStyle: 'bold'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            if (this.currentFilter[type] === value) {
                const underline = this.add.rectangle(x, y + 15, tabText.width, 2, COLORS.accent);
                container.add(underline);
            }

            tabText.on('pointerdown', () => {
                this.currentFilter[type] = value;
                this.refreshLeaderboard(container);
            });

            container.add(tabText);
            return tabText;
        };

        const filterY = -270;
        createTab(-150, filterY, 'Tudo', 'all_time', 'period');
        createTab(0, filterY, 'Semanal', 'weekly', 'period');
        createTab(150, filterY, 'Mensal', 'monthly', 'period');

        // Initial Load
        this.refreshLeaderboard(container);

        container.setScale(0);
        this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 300, ease: 'Back.easeOut' });
    }

    async refreshLeaderboard(container) {
        // Clear previous list items (keep static UI)
        container.list.filter(child => child.isListItem).forEach(c => c.destroy());

        const loading = this.add.text(0, 0, 'Carregando...', { fontSize: '20px', fill: '#ccc' }).setOrigin(0.5);
        loading.isListItem = true;
        container.add(loading);

        try {
            // Build Query Params using Domain Logic (simplified here for UI)
            // In a pure Clean Architecture, we'd use LeaderboardCriteria.toQueryParams()
            const params = new URLSearchParams(this.currentFilter);

            const res = await fetch(`/api/leaderboard?${params.toString()}`);
            const data = await res.json();

            loading.destroy();

            if (!Array.isArray(data) || data.length === 0) {
                const noData = this.add.text(0, 0, 'Ainda sem recordes para este período!', { fontSize: '20px', fill: '#7f8c8d' }).setOrigin(0.5);
                noData.isListItem = true;
                container.add(noData);
            } else {
                let y = -220;

                // Headers
                const headers = [
                    { x: -250, text: '#' },
                    { x: -180, text: 'JOGADOR' },
                    { x: 150, text: 'NOTA' },
                    { x: 240, text: '%' }
                ];

                headers.forEach(h => {
                    const t = this.add.text(h.x, y, h.text, { fontSize: '14px', fill: '#576574', fontFamily: VISUAL_CONFIG.fontFamily, fontStyle: 'bold' }).setOrigin(0, 0.5);
                    if (h.text === '%') t.setOrigin(1, 0.5);
                    t.isListItem = true;
                    container.add(t);
                });

                y += 40;

                data.forEach((entry, index) => {
                    const color = index === 0 ? '#f1c40f' : (index === 1 ? '#bdc3c7' : (index === 2 ? '#cd7f32' : '#ffffff'));

                    const rank = this.add.text(-250, y, `#${index + 1}`, { fontSize: '20px', fill: color, fontFamily: VISUAL_CONFIG.fontFamily }).setOrigin(0, 0.5);
                    const name = this.add.text(-180, y, (entry.playerName || 'Anônimo').substring(0, 20), { fontSize: '20px', fill: color, fontFamily: VISUAL_CONFIG.fontFamily }).setOrigin(0, 0.5);
                    const score = this.add.text(150, y, `${entry.score}/${entry.total}`, { fontSize: '20px', fill: color, fontFamily: VISUAL_CONFIG.fontFamily }).setOrigin(0, 0.5);
                    const percent = this.add.text(240, y, `${entry.percentage}%`, { fontSize: '16px', fill: '#95a5a6', fontFamily: VISUAL_CONFIG.fontFamily }).setOrigin(1, 0.5);

                    rank.isListItem = true;
                    name.isListItem = true;
                    score.isListItem = true;
                    percent.isListItem = true;

                    container.add([rank, name, score, percent]);
                    y += 50;
                });
            }
        } catch (e) {
            loading.setText('Erro ao carregar ranking');
            console.error(e);
        }
    }
}
