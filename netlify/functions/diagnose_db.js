import { sql } from "../../db";

export default async (req) => {
    try {
        console.log("Diagnose DB: Env Var Mode");

        // 1. Simple Connection Test
        const now = await sql`SELECT NOW()`;
        console.log("Connection OK:", now);

        // 2. Check Tables
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `;

        // 3. Check Columns
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'game_history';
        `;

        return new Response(JSON.stringify({
            status: "Connected",
            time: now[0],
            tables: tables,
            game_history_columns: columns
        }, null, 2), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (e) {
        console.error("Diagnostic Failed:", e);
        return new Response(JSON.stringify({
            error: e.message,
            code: e.code,
            detail: e.detail,
            hint: e.hint,
            name: e.name,
            cause: e.cause
        }, null, 2), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config = {
    path: "/api/diagnose_db"
};
