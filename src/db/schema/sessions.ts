import { int, mysqlEnum, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { classes } from "./classes";


export const sessions = mysqlTable('sessions', {
    id: int('id').primaryKey().autoincrement(),
    state: mysqlEnum(['waiting', 'started', 'finished']).notNull().default('waiting'),
    phase: mysqlEnum(['training_1.1', 'training_1.2', 'test1', 'training_2.1', 'training_2.2', 'test2']).notNull(),
    code: varchar('code', { length: 16 }).notNull().unique(),
    details: varchar('details', { length: 256 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    startedAt: timestamp('started_at'),
    userId: int('user_id').notNull().references(() => users.id),
    classId: int('class_id').notNull().references(() => classes.id),
});