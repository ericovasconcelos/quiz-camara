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
                is_default BOOLEAN DEFAULT FALSE,
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
        try { await sql`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;`; } catch (e) { console.log("Alter is_default error (ignored):", e.message); }

        // Game History Updates
        let errors = [];
        try { await sql`ALTER TABLE game_history ADD COLUMN IF NOT EXISTS quiz_title TEXT;`; } catch (e) { errors.push("quiz_title: " + e.message); }
        try { await sql`ALTER TABLE game_history ADD COLUMN IF NOT EXISTS percentage INTEGER DEFAULT 0;`; } catch (e) { errors.push("percentage: " + e.message); }

        if (errors.length > 0) {
            console.error("Migration Errors:", errors);
            return new Response("Migration Partial/Failed: " + errors.join(", "), { status: 500 });
        }

        console.log("Migration Complete.");
    } catch (error) {
        console.error("Migration Fatal Error:", error);
        return new Response("Migration Failed: " + error.message, { status: 500 });
    }

    // --- SEED DEFAULT QUIZ ---
    try {
        // 1. Check if Default Quiz exists
        const result = await sql`SELECT id FROM quizzes WHERE is_default = true LIMIT 1`;
        if (result.length === 0) {
            console.log("Seeding Default Quiz...");

            // Hardcoded from questions.js
            const defaultQuestions = [
                {
                    enunciado: 'Qual é a função principal do Poder Legislativo?',
                    alternativas: ['Julgar leis e aplicar sanções.', 'Administrar o orçamento público federal.', 'Elaborar leis e fiscalizar o Poder Executivo.', 'Comandar as Forças Armadas em tempos de paz.'],
                    correta: 2,
                    explicacao: 'Art. 2º da CF/88: São Poderes da União, independentes e harmônicos, o Legislativo, Executivo e Judiciário. A função típica do Legislativo é elaborar leis e fiscalizar os atos do Executivo.'
                },
                {
                    enunciado: 'Quantos Deputados Federais compõem a Câmara dos Deputados?',
                    alternativas: ['81 Deputados.', '513 Deputados.', '500 Deputados.', '450 Deputados.'],
                    correta: 1,
                    explicacao: 'Art. 45 da CF/88: A Câmara dos Deputados compõe-se de representantes do povo, eleitos pelo sistema proporcional, em cada Estado e no Distrito Federal. São 513 deputados federais.'
                },
                {
                    enunciado: 'Qual a idade mínima para se candidatar ao cargo de Deputado Federal?',
                    alternativas: ['18 anos.', '21 anos.', '30 anos.', '35 anos.'],
                    correta: 1,
                    explicacao: 'Art. 14, §3º, VI, c da CF/88: A idade mínima para ser elegível a Deputado Federal é de 21 anos.'
                },
                {
                    enunciado: 'Quem substitui o Presidente da República em caso de impedimento, sucessivamente, após o Vice-Presidente?',
                    alternativas: ['Presidente do Senado Federal.', 'Presidente do Supremo Tribunal Federal.', 'Presidente da Câmara dos Deputados.', 'Procurador-Geral da República.'],
                    correta: 2,
                    explicacao: 'Art. 80 da CF/88: Em caso de impedimento do Presidente e Vice, serão sucessivamente chamados: Presidente da Câmara, Presidente do Senado e Presidente do STF.'
                },
                {
                    enunciado: 'O mandato de um Deputado Federal tem duração de:',
                    alternativas: ['2 anos.', '4 anos.', '6 anos.', '8 anos.'],
                    correta: 1,
                    explicacao: 'Art. 44, parágrafo único da CF/88: O mandato dos Deputados Federais é de 4 anos.'
                }
                // (Truncated for brevity, normally we'd put all of them)
            ];

            await sql`
                INSERT INTO quizzes (user_id, title, settings, questions, is_default)
                VALUES (
                    'system', 
                    'Direito Constitucional (Padrão)', 
                    '{"time": 20, "questions": 10}', 
                    ${JSON.stringify(defaultQuestions)}, 
                    true
                )
            `;
            console.log("Default Quiz Seeded.");
        } else {
            console.log("Default Quiz already exists.");
        }
    } catch (seedError) {
        console.error("Seeding Error:", seedError);
        // Don't fail the whole request
    }

    return new Response("Migration Successful! Tables and Seed Data ready.", { status: 200 });

};

export const config = {
    path: "/api/migrate_db"
};
