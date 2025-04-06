import { boolean, int, longtext, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { sessions } from "./sessions";
import { sessionKeys } from "./sessionKeys";

export const verifyLevelLogs = mysqlTable('logs_verify_level', {
    id: int('id').primaryKey().autoincrement(),
    action: varchar('action', {length: 10}).notNull().default('ver_lvl'),
    level: int('level').notNull(),
    outcome: boolean('outcome').notNull(),
    board: longtext('board').notNull(),
    timestamp: timestamp('timestamp').notNull().defaultNow(),
    session_id: int('session_id').notNull().references(() => sessions.id),
    pupil_id: int('pupil_id').notNull().references(() => sessionKeys.id),
});