import { COLORS, VISUAL_CONFIG, STORAGE_KEY_HIGHSCORE } from '../constants.js';
import { ParticleManager } from '../utils/ParticleManager.js';
import { saveHighScore, getAuthToken } from '../utils/helpers.js';

// --- CENA DE RESULTADO ---
export class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScene' });
    }

    create(data) {
        const { width, height } = this.cameras.main;
        const { score, total, correctAnswers } = data;
        // Fix: Calculate percentage based on correct questions, not raw score
        const percentage = Math.round((correctAnswers / total) * 100);

        // 1. Background
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(COLORS.background, COLORS.background, COLORS.backgroundBottom, COLORS.backgroundBottom, 1);
        graphics.fillRect(0, 0, width, height);

        // 2. Ambient Particles
        this.particles = new ParticleManager(this);
        this.particles.createAmbient();

        // 3. High Score logic
        const previousHigh = parseInt(localStorage.getItem(STORAGE_KEY_HIGHSCORE) || '0');
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
        const footer = this.add.text(0, height / 2 - 40, `Recorde Atual: ${parseInt(localStorage.getItem(STORAGE_KEY_HIGHSCORE) || '0')} pontos`, {
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
        getAuthToken().then(token => {
            const saveText = this.add.text(width / 2, height - 40, 'Salvando resultado...', { fontSize: '14px', fill: '#ccc' }).setOrigin(0.5);

            if (token) {
                console.log("Attempting to save with token:", token.substring(0, 10) + "...");

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
                })
                    .then(res => {
                        if (res.ok) {
                            saveText.setText('✅ Resultado salvo no Ranking!');
                            saveText.setStyle({ fill: '#2ecc71', backgroundColor: '#000000', padding: { x: 5, y: 5 } });

                            // Update LocalStorage if better
                            const oldHigh = parseInt(localStorage.getItem(STORAGE_KEY_HIGHSCORE) || '0');
                            if (score > oldHigh) {
                                localStorage.setItem(STORAGE_KEY_HIGHSCORE, score);
                            }
                        } else {
                            if (res.status === 401) {
                                saveText.setText('⚠️ Sessão expirada. Faça login novamente.');
                            } else {
                                saveText.setText('❌ Erro ao salvar');
                            }
                            console.error('Save failed', res);
                        }
                    })
                    .catch(e => {
                        saveText.setText('❌ Falha de conexão');
                        console.error(e);
                    });
            } else {
                // Offline Save (Legacy)
                const oldHigh = parseInt(localStorage.getItem(STORAGE_KEY_HIGHSCORE) || '0');
                if (score > oldHigh) {
                    localStorage.setItem(STORAGE_KEY_HIGHSCORE, score);
                    this.add.text(width / 2, height - 60, '🏆 Novo Recorde Local!', { fontSize: '16px', fill: '#f1c40f' }).setOrigin(0.5);
                }
                saveText.setText('⚠️ Faça login para salvar no Ranking Global');
                saveText.setStyle({ fill: '#e67e22' });
            }
        });

        this.time.addEvent({
            delay: 500,
            callback: () => this.cameras.main.fadeIn(500, 0, 0, 0)
        });
    }
}
