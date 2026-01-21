import { db } from "../../db";
import { quizzes } from "../../schema";

export default async (req, context) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    // Check for Auth
    const user = context.clientContext && context.clientContext.user;
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const data = await req.json();

        if (!data.title || !data.questions) {
            return new Response(JSON.stringify({ error: "Missing title or questions" }), { status: 400 });
        }

        const inserted = await db.insert(quizzes).values({
            userId: user.sub,
            title: data.title,
            settings: data.config || {}, // Save config as settings
            questions: data.questions,
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
    path: "/api/quizzes/add"
};
