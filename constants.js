// --- CONFIGURAÇÕES E CONSTANTES ---
// --- CONFIGURAÇÕES VISUAIS E CONSTANTES ---
export const STORAGE_KEY_HIGHSCORE = 'quizCamaraHighScore';
export const COLORS = {
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

export const VISUAL_CONFIG = {
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

export const GAME_CONFIG = {
    questionsPerGame: 10,
    timePerQuestion: 20,
    explanationDisplayTime: 4000
};
