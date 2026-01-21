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
    loadQuizzes();
    renderCurrentStatus();
    renderQuizList();
});

// Load from LocalStorage
function loadQuizzes() {
    const storedQuizzes = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    quizzes = storedQuizzes ? JSON.parse(storedQuizzes) : [];

    // Ensure quizzes have IDs
    quizzes.forEach(q => {
        if (!q.id) q.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    });

    currentQuizId = localStorage.getItem(STORAGE_KEYS.CURRENT);
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
function processImport() {
    const input = document.getElementById('json-input').value;

    try {
        const data = JSON.parse(input);

        // Basic Validation
        if (!data.title || !Array.isArray(data.questions) || data.questions.length === 0) {
            throw new Error("Formato inválido. O JSON deve ter 'title' e um array de 'questions'.");
        }

        // Validate Questions
        data.questions.forEach((q, idx) => {
            if (!q.enunciado || !Array.isArray(q.alternativas) || q.alternativas.length !== 4 || typeof q.correta !== 'number') {
                throw new Error(`Erro na questão ${idx + 1}: Formato incorreto.`);
            }
        });

        // Add ID and Save
        const newQuiz = {
            id: Date.now().toString(),
            title: data.title,
            questions: data.questions,
            createdAt: new Date().toISOString()
        };

        quizzes.push(newQuiz);
        saveQuizzes();

        // Success
        showMessage(`Quiz "${newQuiz.title}" importado com sucesso!`, 'success');
        toggleImport();
        renderQuizList();

        // Auto-select the new quiz
        selectQuiz(newQuiz.id);

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
    if (!confirm('Tem certeza que deseja excluir este quiz?')) return;

    quizzes = quizzes.filter(q => q.id !== id);
    saveQuizzes();

    if (currentQuizId === id) {
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
                <p>${quiz.questions.length} questões • Adicionado em ${new Date(quiz.createdAt).toLocaleDateString()}</p>
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
