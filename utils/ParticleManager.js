import { VISUAL_CONFIG } from '../constants.js';

// --- UTILITÁRIOS ---
export class ParticleManager {
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
