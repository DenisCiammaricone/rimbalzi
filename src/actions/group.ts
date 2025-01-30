import { db } from "@/app/lib/db/db";
import { group_permissions } from "@/db/schema/group_permissions";
import { permissions } from "@/db/schema/permissions";
import { eq } from "drizzle-orm";

export async function groupHasPermission(groupId: number, perm: string) {
  const perms = await db.select({id: permissions.id, name: permissions.name})
  .from(group_permissions)
  .leftJoin(permissions, eq(permissions.id, group_permissions.id))
  .where(eq(group_permissions.groupId, groupId));

  if (perms.length === 0) {
    return false;
  }
  
  return true
}