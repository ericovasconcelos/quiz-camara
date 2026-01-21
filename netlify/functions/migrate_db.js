import { neon } from "@neondatabase/serverless";

export default async (req) => {
    if (!process.env.DATABASE_URL) {
        return new Response("DATABASE_URL not set in Netlify Environment Variables.", { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
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

        // Add columns if missing
        try { await sql`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS user_id TEXT;`; } catch (e) { }
        try { await sql`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS settings JSONB;`; } catch (e) { }

        return new Response("Migration Successful! Tables 'quizzes' and 'game_history' are ready.", { status: 200 });

    } catch (error) {
        return new Response("Migration Failed: " + error.message, { status: 500 });
    }
};

export const config = {
    path: "/api/migrate_db"
};
