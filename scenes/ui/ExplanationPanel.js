import { COLORS, VISUAL_CONFIG, GAME_CONFIG } from '../../constants.js';

export class ExplanationPanel extends Phaser.GameObjects.Container {
    constructor(scene, width, height, onNextCallback) {
        // Initial position off-screen
        super(scene, width / 2, height + 300);
        this.scene = scene;
        this.pWidth = width - 40;
        this.pHeight = 250;
        this.onNext = onNextCallback;

        // Cache camera dimensions for animations
        this.cameraHeight = height;

        this.createGraphics();
        scene.add.existing(this);
    }

    createGraphics() {
        // Shadow
        const shadow = this.scene.add.graphics();
        shadow.fillStyle(0x000000, 0.5);
        shadow.fillRoundedRect(-this.pWidth / 2 + 10, -this.pHeight / 2 + 10, this.pWidth, this.pHeight, 20);

        // Main Background
        const bg = this.scene.add.graphics();
        bg.fillStyle(COLORS.cardBg, 0.98);
        bg.fillRoundedRect(-this.pWidth / 2, -this.pHeight / 2, this.pWidth, this.pHeight, 20);
        bg.lineStyle(2, COLORS.accent, 1);
        bg.strokeRoundedRect(-this.pWidth / 2, -this.pHeight / 2, this.pWidth, this.pHeight, 20);

        // Interactive hit area
        bg.setInteractive(new Phaser.Geom.Rectangle(-this.pWidth / 2, -this.pHeight / 2, this.pWidth, this.pHeight), Phaser.Geom.Rectangle.Contains);
        bg.on('pointerdown', () => {
            if (this.onNext) this.onNext();
        });

        // Icon
        this.icon = this.scene.add.text(0, -this.pHeight / 2 + 40, '', { fontSize: '40px' }).setOrigin(0.5);

        // Title
        this.title = this.scene.add.text(0, -this.pHeight / 2 + 80, '', {
            fontSize: '24px',
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Text
        this.text = this.scene.add.text(0, 20, '', {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: this.pWidth - 60 },
            fontFamily: VISUAL_CONFIG.fontFamily,
            lineSpacing: 6
        }).setOrigin(0.5);

        // Next Button hint
        const nextText = this.scene.add.text(0, this.pHeight / 2 - 30, 'Toque para continuar...', {
            fontSize: '14px',
            fill: COLORS.textDim,
            fontFamily: VISUAL_CONFIG.fontFamily,
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Blink animation
        this.scene.tweens.add({
            targets: nextText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.add([shadow, bg, this.icon, this.title, this.text, nextText]);
        this.setDepth(100);
    }

    show(text, wasCorrect, isTimeout = false) {
        const titleText = isTimeout ? '⏰ TEMPO ESGOTADO' : (wasCorrect ? 'CORRETO!' : 'INCORRETO');
        const color = isTimeout ? COLORS.warning : (wasCorrect ? COLORS.success : COLORS.error);
        const iconChar = isTimeout ? '⏳' : (wasCorrect ? '✅' : '❌');

        this.title.setText(titleText);
        this.title.setColor(wasCorrect ? '#2ecc71' : (isTimeout ? '#f39c12' : '#e74c3c'));

        this.icon.setText(iconChar);
        this.text.setText(text);

        // Animation In
        this.scene.tweens.add({
            targets: this,
            y: this.cameraHeight - 125, // Visually centered? depends on layout
            duration: 600,
            ease: 'Back.easeOut'
        });
    }

    hide(onComplete) {
        this.scene.tweens.add({
            targets: this,
            y: this.cameraHeight + 300,
            duration: 500,
            ease: 'Back.easeIn',
            onComplete: onComplete
        });
    }
}
