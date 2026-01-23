import { db } from "../../db";
import { gameHistory } from "../../schema";

export default async (req, context) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const user = context.clientContext && context.clientContext.user;

    // DEBUG LOGGING
    console.log("Function invoked.");
    console.log("Client Context:", JSON.stringify(context.clientContext));
    console.log("Headers Authorization:", req.headers.get("authorization"));

    if (!user) {
        console.log("User not found in context.");
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
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

export const config = {
    path: "/api/history/save"
};
