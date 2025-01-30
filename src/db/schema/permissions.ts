import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const permissions = mysqlTable('permissions', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', {length: 16}).notNull().unique(),
});