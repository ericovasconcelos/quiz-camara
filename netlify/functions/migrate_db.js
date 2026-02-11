import { sql } from "../../db";

export default async (req) => {
    // Check if SQL client is ready
    if (!process.env.DATABASE_URL) {
        return new Response("DATABASE_URL not set.", { status: 500 });
    }

    try {
        console.log("Starting Migration...");

        // 1. Quizzes Table
        await sql`
            CREATE TABLE IF NOT EXISTS quizzes (
                id SERIAL PRIMARY KEY,
                user_id TEXT,
                title TEXT NOT NULL,
                settings JSONB,
                questions JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() NOT NULL
            );
        `;
        console.log("Quizzes table checked.");

        // 2. Game History Table
        await sql`
            CREATE TABLE IF NOT EXISTS game_history (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                player_name TEXT,
                quiz_title TEXT,
                score INTEGER NOT NULL,
                total INTEGER NOT NULL,
                percentage INTEGER NOT NULL,
                played_at TIMESTAMP DEFAULT NOW() NOT NULL
            );
        `;
        console.log("Game History table checked.");

        // Add columns if missing
        try { await sql`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS user_id TEXT;`; } catch (e) { console.log("Alter quizzes error (ignored):", e.message); }
        try { await sql`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS settings JSONB;`; } catch (e) { console.log("Alter settings error (ignored):", e.message); }

        // Game History Updates
        let errors = [];
        try { await sql`ALTER TABLE game_history ADD COLUMN IF NOT EXISTS quiz_title TEXT;`; } catch (e) { errors.push("quiz_title: " + e.message); }
        try { await sql`ALTER TABLE game_history ADD COLUMN IF NOT EXISTS percentage INTEGER DEFAULT 0;`; } catch (e) { errors.push("percentage: " + e.message); }

        if (errors.length > 0) {
            console.error("Migration Errors:", errors);
            return new Response("Migration Partial/Failed: " + errors.join(", "), { status: 500 });
        }

        console.log("Migration Complete.");
        return new Response("Migration Successful! Tables 'quizzes' and 'game_history' are ready.", { status: 200 });

    } catch (error) {
        console.error("Migration Fatal Error:", error);
        return new Response("Migration Failed: " + error.message, { status: 500 });
    }
};

export const config = {
    path: "/api/migrate_db"
};
