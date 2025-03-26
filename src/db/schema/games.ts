import { int, json, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { sessionKeys } from "./sessionKeys";
import { sessions } from "./sessions";

export const games =  mysqlTable('games', {
    id: int('id').primaryKey().autoincrement(),
    moves: json('moves').default([]),
    movesCount: int('moves_count').default(0),
    wrongLevels: int('wrong_levels').default(10),
    sessionKey: varchar('session_key', {length: 8}).notNull().references(() => sessionKeys.key),
    sessionId: int('session_id').notNull().references(() => sessions.id),
});