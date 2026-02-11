import { pgTable, serial, text, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const quizzes = pgTable("quizzes", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    settings: jsonb("settings"), // { timeLimit: number, questionLimit: number }
    questions: jsonb("questions").notNull(),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameHistory = pgTable("game_history", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    playerName: text("player_name"),
    quizTitle: text("quiz_title"),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    percentage: integer("percentage").notNull(),
    playedAt: timestamp("played_at").defaultNow().notNull(),
});
