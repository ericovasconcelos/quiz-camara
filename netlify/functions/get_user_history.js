import { db } from "../../db";
import { gameHistory } from "../../schema";
import { desc, eq } from "drizzle-orm";

export default async (req, context) => {
    const user = context.clientContext && context.clientContext.user;
    if (!user) return new Response(JSON.stringify([]));

    try {
        const history = await db.select()
            .from(gameHistory)
            .where(eq(gameHistory.userId, user.sub))
            .orderBy(desc(gameHistory.playedAt))
            .limit(50); // Limit to last 50 games

        return new Response(JSON.stringify(history), {
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
    path: "/api/history/me"
};
