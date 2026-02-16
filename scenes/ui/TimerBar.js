import { COLORS } from '../../constants.js';

export class TimerBar {
    constructor(scene, x, y, width, height = 10) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.barBg = scene.add.graphics();
        this.bar = scene.add.graphics();

        this.drawBackground();
    }

    drawBackground() {
        this.barBg.clear();
        this.barBg.fillStyle(COLORS.primaryDark, 0.5);
        this.barBg.fillRoundedRect(this.x, this.y, this.width, this.height, 5);
    }

    update(percentage) {
        this.bar.clear();

        // Dynamic Color
        let color = COLORS.success;
        if (percentage < 0.3) color = COLORS.error;
        else if (percentage < 0.6) color = COLORS.warning;

        this.bar.fillStyle(color, 1);
        this.bar.fillRoundedRect(
            this.x,
            this.y,
            this.width * percentage,
            this.height,
            5
        );

        // Optional: Add glow logic here if needed, or keep it simple for now
    }
}
