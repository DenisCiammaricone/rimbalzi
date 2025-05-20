import { int, json, longtext, mysqlEnum, mysqlTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { session_sequences } from "./session_sequences";

export const default_sequences = mysqlTable('default_sequences', {
    id: int('id').primaryKey().autoincrement(),
    grade: int('grade').notNull(),
    phase: varchar('phase', { length: 16 }).notNull(),//TODO: Remember to change this to session_phases enum in enums.ts
    
    sequenceId: int('sequence_id').notNull().default(1).references(() => session_sequences.id),
}, (table) => {
    return {
        gradePhaseIdx: uniqueIndex('grade_phase_unique').on(table.grade, table.phase),
    };
});