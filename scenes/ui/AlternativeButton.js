import { COLORS, VISUAL_CONFIG } from '../../constants.js';

export class AlternativeButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, index, text, letter) {
        super(scene, x, y);
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.index = index;

        this.setSize(width, height);
        this.setInteractive({ useHandCursor: true });

        this.createGraphics(text, letter);
        this.setupEvents();

        scene.add.existing(this);
    }

    createGraphics(text, letter) {
        // Shadow
        this.shadow = this.scene.add.graphics();
        this.shadow.fillStyle(0x000000, 0.3);
        this.shadow.fillRoundedRect(-this.width / 2 + 4, -this.height / 2 + 4, this.width, this.height, VISUAL_CONFIG.borderRadius);

        // Background
        this.bg = this.scene.add.graphics();

        // Border
        this.border = this.scene.add.graphics();

        // Badge
        this.badge = this.scene.add.graphics();
        this.badge.fillStyle(COLORS.primaryDark, 0.5);
        this.badge.fillRoundedRect(-this.width / 2 + 10, -18, 36, 36, 12);

        // Letter
        this.letterText = this.scene.add.text(-this.width / 2 + 28, 0, letter, {
            fontSize: '20px',
            fill: COLORS.accent,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Text
        this.txt = this.scene.add.text(-this.width / 2 + 65, 0, text, {
            fontSize: '18px',
            fill: COLORS.textLight,
            fontFamily: VISUAL_CONFIG.fontFamily,
            wordWrap: { width: this.width - 90 }
        }).setOrigin(0, 0.5);

        this.add([this.shadow, this.bg, this.border, this.badge, this.letterText, this.txt]);

        this.resetStyle();
    }

    setupEvents() {
        this.on('pointerover', () => {
            if (this.scene.isProcessing) return;

            this.scene.tweens.add({
                targets: this,
                scaleX: 1.02,
                scaleY: 1.02,
                duration: 200,
                ease: 'Back.easeOut'
            });

            this.bg.clear();
            this.bg.fillStyle(COLORS.primaryLight, 1);
            this.bg.fillRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, VISUAL_CONFIG.borderRadius);

            this.border.clear();
            this.border.lineStyle(2, COLORS.accent, 0.8);
            this.border.strokeRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, VISUAL_CONFIG.borderRadius);

            this.txt.setColor('#ffffff');
            this.letterText.setColor('#ffffff');
        });

        this.on('pointerout', () => {
            if (this.scene.isProcessing) return;

            this.scene.tweens.add({
                targets: this,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });

            this.resetStyle();
        });
    }

    setText(text) {
        this.txt.setText(text);
    }

    resetStyle() {
        this.bg.clear();
        this.bg.fillStyle(COLORS.cardBg, 1);
        this.bg.fillRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, VISUAL_CONFIG.borderRadius);

        this.border.clear();
        this.txt.setColor(COLORS.textLight ? '#ffffff' : '#ecf0f1');
        this.letterText.setColor(COLORS.accent ? '#d4af37' : '#d4af37');
    }

    highlightCorrect() {
        this.bg.clear();
        this.bg.fillStyle(COLORS.success, 1);
        this.bg.fillRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, VISUAL_CONFIG.borderRadius);

        this.border.clear();
        this.border.lineStyle(3, COLORS.successGlow || 0x2ecc71, 1);
        this.border.strokeRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, VISUAL_CONFIG.borderRadius);
    }

    highlightWrong() {
        this.bg.clear();
        this.bg.fillStyle(COLORS.error, 1);
        this.bg.fillRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, VISUAL_CONFIG.borderRadius);

        this.border.clear();
        this.border.lineStyle(3, COLORS.errorGlow || 0xe74c3c, 1);
        this.border.strokeRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, VISUAL_CONFIG.borderRadius);
    }
}
