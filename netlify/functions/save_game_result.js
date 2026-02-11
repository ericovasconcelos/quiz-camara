import { db } from "../../db";
import { sql } from "drizzle-orm";
import { gameHistory } from "../../schema";

export default async (req, context) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    let user = context.clientContext && context.clientContext.user;

    // DEBUG LOGGING
    console.log("Function invoked.");
    console.log("Client Context:", JSON.stringify(context.clientContext));
    console.log("Headers Authorization:", req.headers.get("authorization"));

    // FALLBACK FOR LOCAL DEV (Netlify Dev sometimes misses context)
    if (!user && req.headers.get("authorization")) {
        console.log("Context missing, attempting manual token decode...");
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
                        console.log("Manual decode successful:", user.email);
                    } else {
                        console.warn("Manual decode: Token expired");
                    }
                }
            }
        } catch (e) {
            console.error("Manual decode failed", e);
        }
    }

    if (!user) {
        console.log("User not found in context or via fallback.");
        return new Response("Unauthorized - User context missing", { status: 401 });
    }
    console.log("User authenticated:", user.email);

    try {
        const data = await req.json();

        // Validation
        if (data.score === undefined || !data.total) {
            return new Response("Missing score data", { status: 400 });
        }

        const inserted = await db.insert(gameHistory).values({
            userId: user.sub,
            playerName: user.user_metadata.full_name || user.email,
            quizTitle: data.quizTitle || 'Jogo Rápido',
            score: data.score,
            total: data.total,
            percentage: data.percentage || Math.round((data.score / data.total) * 100)
        }).returning();

        return new Response(JSON.stringify(inserted[0]), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        // Return full error for debugging
        return new Response(JSON.stringify({ error: error.message, details: error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

export const config = {
    path: "/api/history/save"
};
