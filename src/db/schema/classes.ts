import { char, int, mysqlTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { schools } from "./schools";


export const classes = mysqlTable('classes', {
    id: int('id').primaryKey().autoincrement(),
    grade: int('grade').notNull(),
    section: char('section').notNull(),
    maleNumber: int('male_number').notNull(),
    femaleNumber: int('female_number').notNull(),
    details: varchar('detail', { length: 256 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    teacherId: int('teacher_id').notNull().references(() => users.id),
    schoolId: int('school_id').notNull().references(() => schools.id),
}, (table) => [
    uniqueIndex('class_unique').on(table.grade, table.section, table.schoolId),
]);