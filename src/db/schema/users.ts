import { int, mysqlTable, text } from "drizzle-orm/mysql-core";

export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    name: text('name').notNull().unique(),
    email: text('email').notNull().unique(),
    password: text('password').notNull()
});