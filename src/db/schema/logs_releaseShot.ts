
import { boolean, int, longtext, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { sessions } from "./sessions";
import { sessionKeys } from "./sessionKeys";

export const releaseShotLogs = mysqlTable('logs_release_shot', {
    id: int('id').primaryKey().autoincrement(),
    action: varchar('action', {length: 10}).notNull().default('rel_sht'),
    level: int('level').notNull(),
    from: varchar('from', {length: 5}).notNull(),
    to: varchar('to', {length: 5}).notNull(),
    timestamp: timestamp('timestamp').notNull().defaultNow(),
    session_id: int('session_id').notNull().references(() => sessions.id),
    pupil_id: int('pupil_id').notNull().references(() => sessionKeys.id),
});