import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const quizzes = pgTable("quizzes", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    questions: jsonb("questions").notNull(), // Stores the array of questions
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
