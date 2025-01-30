import { boolean, int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { groups } from "./groups";

export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', {length: 16}).notNull(),
    surname: varchar('surname', {length: 32}).notNull(),
    email: varchar('email', {length: 256}).notNull().unique(),
    password: varchar('password', {length: 256}).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    activeted: boolean('activeted').notNull().default(false),
    groupId: int('group_id').notNull().default(1).references(() => groups.id),
});