const { neon } = require("@neondatabase/serverless");

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL found, skipping migration.");
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log("Running migration...");

  try {
    // 1. Quizzes Table (Update)
    await sql`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        questions JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Add user_id if missing
    try {
      await sql`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS user_id TEXT;`;
    } catch (e) {
      console.log("Column user_id might already exist or error ignored:", e.message);
    }

    // Add settings column if missing (Advanced Settings)
    try {
      await sql`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS settings JSONB;`;
    } catch (e) {
      console.log("Column settings might already exist or error ignored:", e.message);
    }

    // 2. Game History Table (New)
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
    console.log("Migration complete: Tables verified.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

main();
