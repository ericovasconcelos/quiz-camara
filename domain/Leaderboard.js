/**
 * Represents a single entry in the leaderboard.
 */
export class LeaderboardEntry {
    constructor(playerName, score, total, percentage, quizTitle, date) {
        this.playerName = playerName;
        this.score = score;
        this.total = total;
        this.percentage = percentage;
        this.quizTitle = quizTitle;
        this.date = new Date(date);
    }
}

/**
 * Criteria for filtering the leaderboard.
 * This encapsulates the business rules for what we want to see.
 */
export class LeaderboardCriteria {
    constructor({ period = 'all_time', limit = 10, questionCount = null, quizTitle = null } = {}) {
        this.period = period; // 'all_time', 'monthly', 'weekly', 'today'
        this.limit = limit;
        this.questionCount = questionCount; // specific total questions (e.g. 10 or 20)
        this.quizTitle = quizTitle; // specific quiz
    }

    /**
     * Converts criteria to query parameters for the API.
     */
    toQueryParams() {
        const params = new URLSearchParams();
        if (this.period) params.append('period', this.period);
        if (this.limit) params.append('limit', this.limit);
        if (this.questionCount) params.append('questionCount', this.questionCount);
        if (this.quizTitle) params.append('quizTitle', this.quizTitle);
        return params.toString();
    }
}
