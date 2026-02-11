// ============================================
// QUIZ CÂMARA DOS DEPUTADOS - PHASER 3
// ============================================

import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { ResultScene } from './scenes/ResultScene.js';

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
