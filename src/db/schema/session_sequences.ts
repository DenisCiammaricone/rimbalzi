import { int, json, longtext, mysqlEnum, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { classes } from "./classes";

export const session_sequences = mysqlTable('session_sequences', {
    id: int('id').primaryKey().autoincrement(),
    expectedClassGrade: int('expected_class_grade').notNull(),
    sequences: longtext('sequences'),
    details: varchar('details', { length: 256 }),
});