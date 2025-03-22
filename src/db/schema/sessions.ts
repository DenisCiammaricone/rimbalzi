import { boolean, int, mysqlEnum, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { classes } from "./classes";
import { session_sequences } from "./session_sequences";

export const sessions = mysqlTable('sessions', {
    id: int('id').primaryKey().autoincrement(),
    state: varchar('state', { length: 16 }).notNull().default('waiting'), //TODO: Remember to change this to session_states enum in enums.ts
    phase: varchar('phase', { length: 16 }).notNull(),//TODO: Remember to change this to session_phases enum in enums.ts
    code: varchar('code', { length: 16 }).notNull().unique(),
    details: varchar('details', { length: 256 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    startedAt: timestamp('started_at'),
    userId: int('user_id').notNull().references(() => users.id),
    classId: int('class_id').notNull().references(() => classes.id),
    sequenceId: int('sequence_id').notNull().default(1).references(() => session_sequences.id),
});