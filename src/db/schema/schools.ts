import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";


export const schools = mysqlTable('schools', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', {length: 32}).notNull(),
    address: varchar('address', {length: 64}).notNull(),
    codiceIstituto: varchar('codice_istituto', {length: 8}).notNull().unique(),
    codiceScuola: varchar('codice_scuola', {length: 8}).notNull(),
    details: varchar('details', {length: 256}).notNull(),
});