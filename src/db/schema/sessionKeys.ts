import { int, mysqlTable, varchar, char, unique, uniqueIndex } from "drizzle-orm/mysql-core";
import { sessions } from "./sessions";


export const sessionKeys = mysqlTable('sessionKeys', {
    id: int('id').primaryKey().autoincrement(),
    key: varchar('key', {length: 8}).notNull().$default(() => generateUniqueString(8)),
    sex: char('sex').notNull(),
    sessionId: int('session_id').notNull().references(() => sessions.id),
}, (table) => [
    uniqueIndex('sessionKeys_key_sessionId_unique').on(table.key, table.sessionId),
])

function generateUniqueString(length: number = 12): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueString += characters[randomIndex];
    }
    return uniqueString;
  }