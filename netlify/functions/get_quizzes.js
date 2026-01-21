import { db } from "../../db";
import { quizzes } from "../../schema";
import { desc } from "drizzle-orm";

export default async () => {
    try {
        const allQuizzes = await db.select().from(quizzes).orderBy(desc(quizzes.createdAt));

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
