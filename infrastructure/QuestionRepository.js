import { Question } from '../domain/entities.js';

// We will load the Global variable QUESTION_BANK from questions.js
// Since questions.js is a script loaded in HTML, it defines 'const QUESTION_BANK' globally.
// Ideally, we would modularize questions.js, but to minimize changes to data files users might edit, 
// we can also accept it as an argument or expect it on window.
// However, creating a proper module adapter is better for 'Clean Code'.

/**
 * Repository for fetching questions.
 */
export class QuestionRepository {
    constructor(rawQuestions) {
        // If rawQuestions is not provided, try to find it in global scope (legacy support)
        if (!rawQuestions && typeof window !== 'undefined' && window.QUESTION_BANK) {
            this.rawQuestions = window.QUESTION_BANK;
        } else {
            this.rawQuestions = rawQuestions || [];
        }
    }

    /**
     * Get a random set of questions adapted to Domain Entities.
     * @param {number} count 
     * @returns {Question[]}
     */
    getRandomQuestions(count) {
        // Shuffle logic (Fisher-Yates) implementation here to keep it self-contained
        const shuffled = [...this.rawQuestions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const selected = shuffled.slice(0, count);

        // Map to Domain Entities
        return selected.map(q => new Question(
            q.enunciado,
            q.alternativas,
            q.correta,
            q.explicacao
        ));
    }
}
