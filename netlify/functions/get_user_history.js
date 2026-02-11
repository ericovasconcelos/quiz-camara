import { db } from "../../db";
import { gameHistory } from "../../schema";
import { desc, eq } from "drizzle-orm";

export default async (req, context) => {
    let user = context.clientContext && context.clientContext.user;

    // FALLBACK FOR LOCAL DEV
    if (!user && req.headers.get("authorization")) {
        try {
            const token = req.headers.get("authorization").split(" ")[1];
            if (token) {
                const parts = token.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]));
                    if (Date.now() < payload.exp * 1000) {
                        user = {
                            sub: payload.sub,
                            email: payload.email,
                            user_metadata: payload.user_metadata || { full_name: payload.email }
                        };
                    }
                }
            }
        } catch (e) {
            console.error("Manual decode failed", e);
        }
    }

    if (!user) {
        // Return empty history if not logged in (or just 401?)
        // The original code returned [] which implies "no history" for unauth, which is fine for UI
        return new Response(JSON.stringify([]));
    }

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
