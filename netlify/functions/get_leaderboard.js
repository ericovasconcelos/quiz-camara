import { db } from "../../db";
import { gameHistory } from "../../schema";
import { desc, eq, gte, and } from "drizzle-orm";

export default async (req) => {
    try {
        const url = new URL(req.url);
        const period = url.searchParams.get('period') || 'all_time';
        const limitStr = url.searchParams.get('limit') || '10';
        const limit = parseInt(limitStr);
        const questionCountStr = url.searchParams.get('questionCount');
        const quizTitle = url.searchParams.get('quizTitle');

        const conditions = [];

        // 1. Period Filter
        if (period !== 'all_time') {
            const now = new Date();
            let startDate = new Date();

            if (period === 'today') {
                startDate.setHours(0, 0, 0, 0);
            } else if (period === 'weekly') {
                startDate.setDate(now.getDate() - 7);
            } else if (period === 'monthly') {
                startDate.setMonth(now.getMonth() - 1);
            }

            conditions.push(gte(gameHistory.playedAt, startDate));
        }

        // 2. Question Count Filter
        if (questionCountStr) {
            conditions.push(eq(gameHistory.total, parseInt(questionCountStr)));
        }

        // 3. Quiz Title Filter
        if (quizTitle) {
            conditions.push(eq(gameHistory.quizTitle, quizTitle));
        }

        // Execute Query
        let query = db.select({
            playerName: gameHistory.playerName,
            score: gameHistory.score,
            total: gameHistory.total,
            percentage: gameHistory.percentage,
            playedAt: gameHistory.playedAt,
            quizTitle: gameHistory.quizTitle
        })
            .from(gameHistory)
            .orderBy(desc(gameHistory.score), desc(gameHistory.percentage), desc(gameHistory.playedAt))
            .limit(limit);

        if (conditions.length > 0) {
            query.where(and(...conditions));
        }

        const leaderboard = await query;

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
