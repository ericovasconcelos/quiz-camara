
export default async (req) => {
    const dbUrl = process.env.DATABASE_URL;

    return new Response(JSON.stringify({
        hasUrl: !!dbUrl,
        length: dbUrl ? dbUrl.length : 0,
        start: dbUrl ? dbUrl.substring(0, 15) + "..." : "N/A",
        // Check for password segment structure (postgres://user:pass@host)
        structure: dbUrl ? (dbUrl.includes('@') ? "Standard" : "Non-Standard") : "None"
    }), {
        headers: { "Content-Type": "application/json" }
    });
};

export const config = {
    path: "/api/debug_env"
};
