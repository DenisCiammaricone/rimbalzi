import { relations } from "drizzle-orm/relations";
import { groups, groupPermissions, permissions, users, schools } from "./schema";

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

export const usersRelations = relations(users, ({one}) => ({
	group: one(groups, {
		fields: [users.groupId],
		references: [groups.id]
	}),
	school: one(schools, {
		fields: [users.schoolId],
		references: [schools.id]
	}),
}));

export const schoolsRelations = relations(schools, ({many}) => ({
	users: many(users),
}));