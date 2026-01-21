const { neon } = require("@neondatabase/serverless");

async function main() {
    if (!process.env.DATABASE_URL) {
        console.log("No DATABASE_URL found, skipping migration.");
        return;
    }

    const sql = neon(process.env.DATABASE_URL);

    console.log("Running migration...");

    try {
        await sql`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        questions JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
        console.log("Migration complete: 'quizzes' table verified.");
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

main();
