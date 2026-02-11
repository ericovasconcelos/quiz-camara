const { neon } = require("@neondatabase/serverless");
const fs = require('fs');
const path = require('path');

// Manually load .env
try {
    const envPath = path.resolve(__dirname, '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.join('=').trim();
        }
    });
} catch (e) {
    console.log("No .env file found or error reading it:", e.message);
}

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
    try {
        console.log("Creating/Verifying 'quizzes' table...");
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
        console.log("✅ 'quizzes' table verified.");

        // Add user_id column if missing (for legacy tables)
        try {
            await sql`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS user_id TEXT;`;
            console.log("✅ 'user_id' column verified.");
        } catch (e) {
            console.log("⚠️ Column check ignored:", e.message);
        }

    } catch (error) {
        console.error("❌ Migration Failed:", error);
    }
}

runMigration();
