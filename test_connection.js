const { neon } = require("@neondatabase/serverless");

const connectionString = "postgresql://neondb_owner:npg_bePwDI9kc4yv@ep-damp-mud-ae0en4hd-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

async function testConnection() {
    console.log("Testing connection to Neon DB...");
    console.log("String:", connectionString);

    try {
        const sql = neon(connectionString);
        const result = await sql`SELECT NOW()`;
        console.log("✅ SUCCESS! Connected at:", result[0].now);

        // Check game_history table
        try {
            const tableCheck = await sql`SELECT count(*) FROM game_history`;
            console.log("✅ Table 'game_history' exists. Rows:", tableCheck[0].count);
        } catch (err) {
            console.log("⚠️ Table 'game_history' query failed (might not exist):", err.message);
        }

    } catch (error) {
        console.error("❌ CONNECTION FAILED:");
        console.error(error);
    }
}

testConnection();
