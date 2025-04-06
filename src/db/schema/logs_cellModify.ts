import { char, int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { sessions } from "./sessions";
import { sessionKeys } from "./sessionKeys";

export const cellModLogs = mysqlTable('logs_cell_modify', {
    id: int('id').primaryKey().autoincrement(),
    action: varchar('action', {length: 10}).notNull().default('mod_cell'),
    level: int('level').notNull(),
    x: int('x').notNull(),
    y: int('y').notNull(),
    startingObstacle: char('starting_obstacle').notNull(),
    newObstacle: char('new_obstacle').notNull(),
    timestamp: timestamp('timestamp').notNull().defaultNow(),
    session_id: int('session_id').notNull().references(() => sessions.id),
    pupil_id: int('pupil_id').notNull().references(() => sessionKeys.id),
});