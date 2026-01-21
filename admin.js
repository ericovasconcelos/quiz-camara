// Storage Keys
const STORAGE_KEYS = {
    QUIZZES: 'quizCamaraQuizzes',      // Array of quiz objects
    CURRENT: 'quizCamaraCurrentQuiz'   // ID of the currently selected quiz (or null for default)
};

// State
let quizzes = [];
let currentQuizId = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    currentQuizId = localStorage.getItem(STORAGE_KEYS.CURRENT); // Keep current selection local
    loadQuizzes();
    renderCurrentStatus();
    renderQuizList();
    loadHistory(); // Initial load if logged in
});

// UI: Tab Switching
window.switchTab = function (tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';

    if (tabName === 'history-section') loadHistory();
    if (tabName === 'leaderboard-section') loadLeaderboard();
};

// UI: Tab Switching (Simple implementation)
window.switchTab = function (tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';

    // Update active button state if we had buttons, but for now we just show/hide
    if (tabName === 'history-section') loadHistory();
    if (tabName === 'leaderboard-section') loadLeaderboard();
};

// Load from API
async function loadQuizzes() {
    try {
        const token = localStorage.getItem('netlify_token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/quizzes', { headers });
        if (!res.ok) throw new Error('Falha ao carregar quizzes');
        quizzes = await res.json();
    } catch (e) {
        console.error(e);
        // Fallback or empty
        quizzes = [];
        const token = localStorage.getItem('netlify_token');
        if (!token) {
            showMessage('Faça login para ver seus quizzes salvos.', 'info');
        } else {
            showMessage('Usando modo offline (nenhum quiz carregado do servidor)', 'error');
        }
    }

    // Sync Local Storage for Game Access (Hybrid approach)
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));

    renderCurrentStatus();
    renderQuizList();
}

// Save to LocalStorage
function saveQuizzes() {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
}

// Toggle Import Section
function toggleImport() {
    const el = document.getElementById('import-section');
    el.style.display = el.style.display === 'none' || el.style.display === '' ? 'block' : 'none';

    // Clear textarea when opening
    if (el.style.display === 'block') {
        document.getElementById('json-input').value = '';
        document.getElementById('json-input').focus();
    }
}

// Process JSON Import
async function processImport() {
    const input = document.getElementById('json-input').value;

    try {
        const data = JSON.parse(input);

        // Basic Validation
        if (!data.title || !Array.isArray(data.questions) || data.questions.length === 0) {
            throw new Error("Formato inválido. O JSON deve ter 'title' e um array de 'questions'.");
        }

        // Optional Config Validation
        const config = data.config || {};
        if (config.time && typeof config.time !== 'number') throw new Error("Configuração de 'time' inválida.");
        if (config.questions && typeof config.questions !== 'number') throw new Error("Configuração de 'questions' (quantidade) inválida.");

        // Validate Questions
        data.questions.forEach((q, idx) => {
            if (!q.enunciado || !Array.isArray(q.alternativas) || q.alternativas.length !== 4 || typeof q.correta !== 'number') {
                throw new Error(`Erro na questão ${idx + 1}: Formato incorreto.`);
            }
        });

        // Save to API
        const token = localStorage.getItem('netlify_token');
        if (!token) {
            showMessage('Você precisa estar logado para salvar quizzes!', 'error');
            return;
        }

        const res = await fetch('/api/quizzes/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: data.title,
                config: data.config,
                questions: data.questions
            })
        });

        if (!res.ok) throw new Error('Erro ao salvar no servidor');

        const savedQuiz = await res.json();
        quizzes.unshift(savedQuiz); // Add to local list

        // Success
        showMessage(`Quiz "${savedQuiz.title}" importado com sucesso!`, 'success');
        toggleImport();

        // Auto-select
        selectQuiz(savedQuiz.id);

        // Sync Local
        localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
        renderQuizList();

    } catch (e) {
        showMessage('Erro ao importar: ' + e.message, 'error');
    }
}

// Select a Quiz to play
function selectQuiz(id) {
    currentQuizId = id;
    localStorage.setItem(STORAGE_KEYS.CURRENT, id);
    renderCurrentStatus();
    renderQuizList();
    showMessage('Quiz selecionado para jogar!', 'success');
}

// Reset to Default (Original Questions)
function resetToDefault() {
    currentQuizId = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT);
    renderCurrentStatus();
    renderQuizList();
    showMessage('Quiz original da Câmara restaurado.', 'success');
}

// Delete a Quiz
function deleteQuiz(id) {
    if (!confirm('Tem certeza? (Isso só afetará sua visão local por enquanto, exclusão de servidor não implementada)')) return;

    quizzes = quizzes.filter(q => q.id !== id);
    // Sync Local
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));

    if (currentQuizId == id) { // Loose equality for string/int ids
        resetToDefault();
    } else {
        renderQuizList();
    }
}

// UI Rendering - Current Status
function renderCurrentStatus() {
    const container = document.getElementById('current-quiz-display');

    if (!currentQuizId) {
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="background: var(--primary); width: 10px; height: 10px; border-radius: 50%;"></div>
                <strong>Padrão:</strong> Questões de Direito Constitucional (Original)
            </div>
        `;
    } else {
        const quiz = quizzes.find(q => q.id === currentQuizId);
        if (quiz) {
            container.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; color: var(--accent);">
                    <div style="background: var(--accent); width: 10px; height: 10px; border-radius: 50%;"></div>
                    <strong>Selecionado:</strong> ${quiz.title} (${quiz.questions.length} questões)
                </div>
            `;
        } else {
            // Fallback if ID invalid
            resetToDefault();
        }
    }
}

// UI Rendering - Quiz List
function renderQuizList() {
    const list = document.getElementById('quiz-list-container');
    list.innerHTML = '';

    if (quizzes.length === 0) {
        list.innerHTML = '<li style="text-align: center; color: #7f8c8d; padding: 20px;">Nenhum quiz importado. Use o botão acima para adicionar.</li>';
        return;
    }

    quizzes.forEach(quiz => {
        const li = document.createElement('li');
        li.className = `quiz-item ${currentQuizId === quiz.id ? 'active' : ''}`;

        li.innerHTML = `
            <div class="quiz-info">
                <h3>${quiz.title}</h3>
                <p>
                    ${quiz.questions.length} questões totais 
                    ${quiz.settings && quiz.settings.questions ? `(Joga-se ${quiz.settings.questions})` : ''} • 
                    ${quiz.settings && quiz.settings.time ? `⏱️ ${quiz.settings.time}s` : '⏱️ 20s'} • 
                    Adicionado em ${new Date(quiz.createdAt).toLocaleDateString()}
                </p>
            </div>
            <div class="quiz-actions">
                ${currentQuizId !== quiz.id ?
                `<button class="btn btn-sm" onclick="selectQuiz('${quiz.id}')">Jogar</button>` :
                `<span style="color: var(--success); font-size: 12px; font-weight: bold; padding: 5px;">ATIVO</span>`
            }
                <button class="btn btn-sm btn-danger" onclick="deleteQuiz('${quiz.id}')">Excluir</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// Helper: Show Alert Message
function showMessage(msg, type) {
    const el = document.getElementById('message-area');
    el.textContent = msg;
    el.className = `alert alert-${type}`;
    el.style.display = 'block';

    setTimeout(() => {
        el.style.display = 'none';
    }, 3000);
}

// Helper: Copy Prompt
function copyPrompt() {
    const text = `Gere um arquivo JSON com 10 questões de múltipla escolha sobre [TEMA DESEJADO].
O JSON deve seguir estritamente este formato, sem markdown ao redor:
{
  "title": "Título do Quiz",
  "config": {
    "time": 30, // Tempo em segundos por pergunta (Opcional)
    "questions": 10 // Quantidade de perguntas por rodada (Opcional)
  },
  "questions": [
    {
      "enunciado": "Texto da pergunta?",
      "alternativas": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correta": 0, // Índice da correta (0 a 3)
      "explicacao": "Explicação breve da resposta."
    }
  ]
}`; // Simplified for clean copy

    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('button[onclick="copyPrompt()"]');
        const originalText = btn.textContent;
        btn.textContent = "Copiado!";
        setTimeout(() => btn.textContent = originalText, 1500);
    });
}

// --- HISTORY & LEADERBOARD ---

async function loadHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '<li>Carregando...</li>';

    const token = localStorage.getItem('netlify_token');
    if (!token) {
        list.innerHTML = '<li>Faça login para ver seu histórico.</li>';
        return;
    }

    try {
        const res = await fetch('/api/history/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const history = await res.json();

        list.innerHTML = '';
        if (history.length === 0) {
            list.innerHTML = '<li>Nenhum jogo registrado ainda.</li>';
            return;
        }

        history.forEach(h => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${h.quizTitle}</strong><br>
                Pontos: ${h.score}/${h.total} (${h.percentage}%) • ${new Date(h.playedAt).toLocaleDateString()}
            `;
            li.style.padding = "10px";
            li.style.borderBottom = "1px solid #eee";
            list.appendChild(li);
        });
    } catch (e) {
        list.innerHTML = '<li>Erro ao carregar histórico.</li>';
    }
}

async function loadLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '<li>Carregando...</li>';

    try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();

        list.innerHTML = '';
        if (data.length === 0) {
            list.innerHTML = '<li>Sem recordes.</li>';
            return;
        }

        data.forEach((entry, i) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span style="font-weight:bold; color: ${i < 3 ? '#d4af37' : '#555'}">#${i + 1}</span> 
                ${entry.playerName || 'Anônimo'} — 
                <strong>${entry.score}/${entry.total}</strong> (${entry.percentage}%)
            `;
            li.style.padding = "10px";
            li.style.borderBottom = "1px solid #eee";
            list.appendChild(li);
        });
    } catch (e) {
        list.innerHTML = '<li>Erro ao carregar ranking.</li>';
    }
}
