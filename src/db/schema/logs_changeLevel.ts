import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { sessions } from "./sessions";
import { sessionKeys } from "./sessionKeys";

export const changeLevelLogs = mysqlTable('logs_change_level', {
    id: int('id').primaryKey().autoincrement(),
    action: varchar('action', {length: 10}).notNull().default('chg_lvl'),
    level: int('level').notNull(),
    to: int('to').notNull(),
    timestamp: timestamp('timestamp').notNull().defaultNow(),
    session_id: int('session_id').notNull().references(() => sessions.id),
    pupil_id: int('pupil_id').notNull().references(() => sessionKeys.id),
});