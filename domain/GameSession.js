import { GameState, AnswerResult } from './entities.js';

export class GameSession {
    constructor() {
        // Configuration defaults
        this.config = {
            questionsPerGame: 10,
            timePerQuestion: 20, // seconds
            pointsPerQuestion: 100,
            streakBonus: 20 // Extra points per streak step
        };

        // State
        this.state = GameState.INIT;
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.timeLeft = 0; // Current question timer
        this.stats = {
            correct: 0,
            wrong: 0,
            timeouts: 0
        };
    }

    /**
     * Starts a new game session with the provided questions.
     * @param {Question[]} questions - Array of Question entities.
     * @param {Object} config - Optional config overrides.
     */
    start(questions, config = {}) {
        this.questions = questions;
        this.config = { ...this.config, ...config };
        this.currentIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.stats = { correct: 0, wrong: 0, timeouts: 0 };

        this._startQuestion();
    }

    /**
     * Logic to prepare the next question.
     * Resets timer and state.
     */
    _startQuestion() {
        if (this.currentIndex >= this.questions.length) {
            this.state = GameState.FINISHED;
            return;
        }

        this.state = GameState.WAITING_FOR_ANSWER;
        this.timeLeft = this.config.timePerQuestion;
    }

    /**
     * Gets the current question.
     * @returns {Question|null}
     */
    getCurrentQuestion() {
        if (this.currentIndex < this.questions.length) {
            return this.questions[this.currentIndex];
        }
        return null;
    }

    /**
     * Decrements the timer. Should be called by the game loop (e.g., every second).
     * @returns {boolean} True if time ran out this tick.
     */
    tick(deltaTimeSeconds = 1) {
        if (this.state !== GameState.WAITING_FOR_ANSWER) return false;

        this.timeLeft -= deltaTimeSeconds;
        if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            return true; // Signal that timeout occurred
        }
        return false;
    }

    /**
     * Helper to handle timeout specific logic.
     * @returns {AnswerResult}
     */
    handleTimeout() {
        return this.submitAnswer(-1, true);
    }

    /**
     * Submits an answer for the current question.
     * @param {number} selectedIndex - Index of the selected alternative (0-3). Use -1 for timeout.
     * @param {boolean} isManualTimeout - Force timeout externally.
     * @returns {AnswerResult} The result of the answer.
     */
    submitAnswer(selectedIndex, isManualTimeout = false) {
        if (this.state !== GameState.WAITING_FOR_ANSWER) {
            throw new Error("Cannot answer in current state: " + this.state);
        }

        const question = this.getCurrentQuestion();
        const isCorrect = !isManualTimeout && (selectedIndex === question.correctIndex);
        let scoreDelta = 0;

        // Update Stats & Score
        if (isCorrect) {
            this.streak++;
            // Calculate Score: Base + (TimeRemaining * Factor) + (Streak * Bonus)
            // Example: 100 + (15s * 5) + (2 * 20)
            const timeBonus = Math.ceil(this.timeLeft * 5);
            const streakBonus = (this.streak > 1) ? (this.streak - 1) * this.config.streakBonus : 0;
            scoreDelta = this.config.pointsPerQuestion + timeBonus + streakBonus;

            this.score += scoreDelta;
            this.stats.correct++;
        } else {
            this.streak = 0;
            scoreDelta = 0;
            if (isManualTimeout || selectedIndex === -1) {
                this.stats.timeouts++;
            } else {
                this.stats.wrong++;
            }
        }

        this.state = GameState.ANSWER_SUBMITTED;

        return new AnswerResult(
            isCorrect,
            scoreDelta,
            question.correctIndex,
            selectedIndex,
            question.explanation,
            isManualTimeout || selectedIndex === -1
        );
    }

    /**
     * Advances to the next question.
     * @returns {boolean} True if there is a next question, False if game finished.
     */
    nextQuestion() {
        this.currentIndex++;
        this._startQuestion();
        return this.state !== GameState.FINISHED;
    }

    /**
     * Returns progress ratio regarding questions (0.0 to 1.0).
     */
    getProgress() {
        if (this.questions.length === 0) return 0;
        // currentIndex is 0-based, so for UI visualization we might use currentIndex / length 
        // or (currentIndex + 1) depending on when this is called.
        // Let's return purely completed questions ratio.
        return this.currentIndex / this.questions.length;
    }
}
