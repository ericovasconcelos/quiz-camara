import { db } from "../../db";
import { sql } from "drizzle-orm";

export default async (req) => {
    console.log("Setup Schema: Start");

    // 1. Validate Env
    if (!process.env.DATABASE_URL) {
        return new Response("DATABASE_URL missing", { status: 500 });
    }

    try {
        // 2. Test Connection
        console.log("Testing connection...");
        const test = await db.execute(sql`SELECT 1 as val`);
        console.log("Connection OK:", test);

        // 3. Run DDLs
        console.log("Creating tables...");

        // Quizzes
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS quizzes (
                id SERIAL PRIMARY KEY,
                user_id TEXT,
                title TEXT NOT NULL,
                settings JSONB,
                questions JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() NOT NULL
            );
        `);

        // Game History
        await db.execute(sql`
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
        `);

        // 4. Add Columns (Idempotent)
        console.log("Updating columns...");

        const safeAlter = async (query, name) => {
            try {
                await db.execute(query);
                console.log(`Alter ${name}: Success`);
            } catch (e) {
                console.log(`Alter ${name}: Ignored (${e.message})`);
            }
        };

        await safeAlter(sql`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS user_id TEXT;`, "quizzes.user_id");
        await safeAlter(sql`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS settings JSONB;`, "quizzes.settings");
        await safeAlter(sql`ALTER TABLE game_history ADD COLUMN IF NOT EXISTS quiz_title TEXT;`, "game_history.quiz_title");
        await safeAlter(sql`ALTER TABLE game_history ADD COLUMN IF NOT EXISTS percentage INTEGER DEFAULT 0;`, "game_history.percentage");

        return new Response("Schema Setup Complete! You can play now.", { status: 200 });

    } catch (e) {
        console.error("Setup Failed Full:", e);
        // Extract useful postgres error details if available
        const details = {
            message: e.message,
            code: e.code, // Postgres error code
            detail: e.detail,
            hint: e.hint,
            cause: e.cause
        };
        return new Response(JSON.stringify(details, null, 2), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config = {
    path: "/api/setup_schema"
};
