/**
 * Represents a single quiz question.
 */
export class Question {
    /**
     * @param {string} enunciado - The question text.
     * @param {string[]} alternativas - Array of 4 possible answers.
     * @param {number} correctIndex - Index of the correct answer (0-3).
     * @param {string} explanation - Text explaining why the answer is correct.
     */
    constructor(enunciado, alternativas, correctIndex, explanation) {
        this.enunciado = enunciado;
        this.alternativas = alternativas;
        this.correctIndex = correctIndex;
        this.explanation = explanation;
    }
}

/**
 * Enum for the current state of the game session.
 * Not using TypeScript enums, so using a frozen object.
 */
export const GameState = Object.freeze({
    INIT: 'INIT',
    WAITING_FOR_ANSWER: 'WAITING_FOR_ANSWER',
    ANSWER_SUBMITTED: 'ANSWER_SUBMITTED', // Showing feedback/explanation
    FINISHED: 'FINISHED'
});

/**
 * Result of submitting an answer.
 */
export class AnswerResult {
    /**
     * @param {boolean} isCorrect
     * @param {number} scoreDelta - Points earned (or 0)
     * @param {number} correctIndex
     * @param {number} selectedIndex
     * @param {string} explanation
     * @param {boolean} isTimeout
     */
    constructor(isCorrect, scoreDelta, correctIndex, selectedIndex, explanation, isTimeout = false) {
        this.isCorrect = isCorrect;
        this.scoreDelta = scoreDelta;
        this.correctIndex = correctIndex;
        this.selectedIndex = selectedIndex;
        this.explanation = explanation;
        this.isTimeout = isTimeout;
    }
}
