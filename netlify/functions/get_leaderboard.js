import { db } from "../../db";
import { gameHistory } from "../../schema";
import { desc } from "drizzle-orm";

export default async () => {
    try {
        // Simple Top 10 by Score, then Percentage, then Date
        const leaderboard = await db.select({
            playerName: gameHistory.playerName,
            score: gameHistory.score,
            total: gameHistory.total,
            percentage: gameHistory.percentage,
            playedAt: gameHistory.playedAt,
            quizTitle: gameHistory.quizTitle
        })
            .from(gameHistory)
            .orderBy(desc(gameHistory.score), desc(gameHistory.percentage), desc(gameHistory.playedAt))
            .limit(10);

        return new Response(JSON.stringify(leaderboard), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

export const config = {
    path: "/api/leaderboard"
};
