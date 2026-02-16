import { questions } from '../questions.js';
import { Question } from '../domain/entities.js';

/**
 * Repository for fetching questions.
 */
export class QuestionRepository {
    constructor(rawQuestions) {
        // Use provided questions or default to the imported static list
        this.rawQuestions = rawQuestions || questions;
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
