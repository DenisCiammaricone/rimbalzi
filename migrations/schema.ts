import { mysqlTable, mysqlSchema, AnyMySqlColumn, unique, int, varchar, foreignKey, timestamp } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const groups = mysqlTable("groups", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 16 }).notNull(),
},
(table) => [
	unique("groups_name_unique").on(table.name),
]);

export const groupPermissions = mysqlTable("group_permissions", {
	id: int().autoincrement().notNull(),
	groupId: int("group_id").notNull().references(() => groups.id),
	permissionId: int("permission_id").notNull().references(() => permissions.id),
});

export const permissions = mysqlTable("permissions", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 16 }).notNull(),
},
(table) => [
	unique("permissions_name_unique").on(table.name),
]);

export const schools = mysqlTable("schools", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 32 }).notNull(),
	address: varchar({ length: 64 }).notNull(),
	codiceIstituto: varchar("codice_istituto", { length: 8 }).notNull(),
	codiceScuola: varchar("codice_scuola", { length: 8 }).notNull(),
	details: varchar({ length: 256 }).notNull(),
},
(table) => [
	unique("schools_codice_istituto_unique").on(table.codiceIstituto),
]);

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 16 }).notNull(),
	surname: varchar({ length: 32 }).notNull(),
	email: varchar({ length: 256 }).notNull(),
	password: varchar({ length: 256 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
	activeted: tinyint().default(0).notNull(),
	groupId: int("group_id").default(1).notNull().references(() => groups.id),
	schoolId: int("school_id").default('NULL').references(() => schools.id),
},
(table) => [
	unique("users_email_unique").on(table.email),
]);
