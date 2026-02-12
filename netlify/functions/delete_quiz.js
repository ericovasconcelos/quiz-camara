import { db } from "../../db";
import { quizzes } from "../../schema";
import { eq, and } from "drizzle-orm";

export default async (req, context) => {
    if (req.method !== "DELETE") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    // Check for Auth
    let user = context.clientContext && context.clientContext.user;

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
            console.error("Manual decode failed in delete_quiz", e);
        }
    }

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const quizId = body.id;

        if (!quizId) {
            return new Response(JSON.stringify({ error: "Missing quiz ID" }), { status: 400 });
        }

        // Execute Delete
        // Ensure user can only delete their own quizzes
        const result = await db.delete(quizzes)
            .where(and(
                eq(quizzes.id, quizId),
                eq(quizzes.userId, user.sub)
            ))
            .returning();

        if (result.length === 0) {
            return new Response(JSON.stringify({ error: "Quiz not found or unauthorized" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Quiz deleted successfully", id: quizId }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Delete error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

export const config = {
    path: "/api/quizzes/delete"
};
