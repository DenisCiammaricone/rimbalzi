import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { groups } from "./groups";
import { permissions } from "./permissions";

export const group_permissions = mysqlTable('group_permissions', {
    id: int('id').primaryKey().autoincrement(),
    groupId: int('group_id').notNull().references(() => groups.id),
    permissionId: int('permission_id').notNull().references(() => permissions.id),
});