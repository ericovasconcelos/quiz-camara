
const STORAGE_KEYS = {
    QUIZZES: 'quizCamaraQuizzes',
    CURRENT_ID: 'quizCamaraCurrentQuiz'
};

export class QuizRepository {
    constructor() {
        this.cache = null;
    }

    /**
     * Helper to get JWT if logged in
     */
    async _getToken() {
        if (window.netlifyIdentity && window.netlifyIdentity.currentUser()) {
            return await window.netlifyIdentity.currentUser().jwt(true);
        }
        return null;
    }

    /**
     * Fetches all available quizzes (Local + API)
     * Strategies:
     * 1. Try API. If success, update Cache and LocalStorage.
     * 2. If API fails, return LocalStorage.
     * @returns {Promise<Array>}
     */
    async getAll() {
        try {
            const token = await this._getToken();
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch('/api/quizzes', { headers });
            if (!res.ok) throw new Error('API Sync Failed');

            const serverQuizzes = await res.json();

            // Persist
            this._saveToLocal(serverQuizzes);
            return serverQuizzes;

        } catch (e) {
            console.warn("QuizRepository: Fetch failed, using offline cache.", e);
            return this._loadFromLocal();
        }
    }

    async add(quizData) {
        const token = await this._getToken();
        if (!token) throw new Error("User must be logged in to add a quiz.");

        const res = await fetch('/api/quizzes/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(quizData)
        });

        if (!res.ok) throw new Error("Failed to save quiz");

        const newQuiz = await res.json();

        // Update Local Cache optimistically
        const current = this._loadFromLocal();
        // Check if exists (dedupe?)
        const updated = [newQuiz, ...current];
        this._saveToLocal(updated);

        return newQuiz;
    }

    async delete(id) {
        const token = await this._getToken();
        if (!token) throw new Error("User must be logged in to delete a quiz.");

        const res = await fetch('/api/quizzes/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: id })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Failed to delete quiz");
        }

        // Update Local Cache optimistically
        const current = this._loadFromLocal();
        const updated = current.filter(q => q.id !== id);
        this._saveToLocal(updated);
    }

    select(id) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_ID, id);
    }

    getSelectedId() {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_ID);
    }

    getSelectedQuiz() {
        const id = this.getSelectedId();
        if (!id) return null;

        const quizzes = this._loadFromLocal();
        return quizzes.find(q => q.id == id) || null; // Abstract loose comparison
    }

    resetSelection() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_ID);
    }

    // --- Private ---

    _saveToLocal(quizzes) {
        localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
        this.cache = quizzes;
    }

    _loadFromLocal() {
        if (this.cache) return this.cache;
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES) || '[]');
        } catch {
            return [];
        }
    }
}

// Singleton Instance
export const quizRepository = new QuizRepository();
