import { relations } from "drizzle-orm/relations";
import { schools, classes, users, groups, groupPermissions, permissions } from "./schema";

export const classesRelations = relations(classes, ({one}) => ({
	school: one(schools, {
		fields: [classes.schoolId],
		references: [schools.id]
	}),
	user: one(users, {
		fields: [classes.teacherId],
		references: [users.id]
	}),
}));

export const schoolsRelations = relations(schools, ({many}) => ({
	classes: many(classes),
	users: many(users),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	classes: many(classes),
	group: one(groups, {
		fields: [users.groupId],
		references: [groups.id]
	}),
	school: one(schools, {
		fields: [users.schoolId],
		references: [schools.id]
	}),
}));

export const groupPermissionsRelations = relations(groupPermissions, ({one}) => ({
	group: one(groups, {
		fields: [groupPermissions.groupId],
		references: [groups.id]
	}),
	permission: one(permissions, {
		fields: [groupPermissions.permissionId],
		references: [permissions.id]
	}),
}));

export const groupsRelations = relations(groups, ({many}) => ({
	groupPermissions: many(groupPermissions),
	users: many(users),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	groupPermissions: many(groupPermissions),
}));