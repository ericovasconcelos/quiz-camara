import { db } from "../../db";
import { quizzes } from "../../schema";
import { desc, eq, or } from "drizzle-orm";

export default async (req, context) => {
    // Check for Auth
    // Check for Auth
    const user = context.clientContext && context.clientContext.user;
    // Auth check is now integrated into the query logic:
    // If user exists: (userId = user.sub OR isDefault = true)
    // If no user: (isDefault = true)

    // FALLBACK FOR LOCAL DEV (Manual JWT Decode)
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
            console.error("Manual decode failed in get_quizzes", e);
        }
    }

    try {
        const query = db.select()
            .from(quizzes)
            .orderBy(desc(quizzes.createdAt));

        if (user) {
            query.where(or(
                eq(quizzes.userId, user.sub),
                eq(quizzes.isDefault, true)
            ));
        } else {
            query.where(eq(quizzes.isDefault, true));
        }

        const allQuizzes = await query;

        return new Response(JSON.stringify(allQuizzes), {
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
    path: "/api/quizzes"
};
