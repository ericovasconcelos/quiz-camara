
const { neon } = require('@neondatabase/serverless');
// Hardcoded for debug avoids missing dotenv dependency
const connectionString = "postgresql://neondb_owner:npg_bePwDI9kc4yv@ep-damp-mud-ae0en4hd-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
const sql = neon(connectionString);

async function checkDb() {
    try {
        console.log("Checking 'quizzes' table...");
        const result = await sql`SELECT * FROM quizzes`;

        console.log(`Found ${result.length} quizzes:`);
        result.forEach(q => {
            console.log(`- [${q.id}] "${q.title}" (User: ${q.user_id || q.userId}, Default: ${q.is_default || q.isDefault})`);
        });

    } catch (e) {
        console.error("Error querying DB:", e);
    }
}

checkDb();
