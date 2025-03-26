import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const groups = mysqlTable('groups', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', {length: 16}).notNull().unique(),
});