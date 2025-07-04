import { db } from "@/lib/db/db";
import { users } from "@/db/schema/users";
import { eq,and } from "drizzle-orm";
import bcrypt from 'bcryptjs';
import { permissions } from "@/db/schema/permissions";
import { group_permissions } from "@/db/schema/group_permissions";
import { groups } from "@/db/schema/groups";

// TODO: Move this in the lib/utils file
function password_verify(passwordLocal: string, passwordDB: string): boolean {
    if (bcrypt.compareSync(passwordLocal, passwordDB)) {
        return true;
    }
    return false;
}

/**
 * @returns school id of a teacher
 */
export async function getTeacherSchoolId(teacher_id: number) {
  return await db.select({ schoolId: users.schoolId }).from(users).where(eq(users.id, teacher_id)).then(res => res[0]?.schoolId);
}

/**
 * TODO: Make it return an instance of User interface
 * @returns user data from the database 
 */
export async function getUserFromDb(email: string, password: string) {
  const res = await db.select({id: users.id, email: users.email, password: users.password, name: users.name, group: groups.name}).from(users).leftJoin(groups, eq(groups.id, users.groupId)).where(eq(users.email, email)).limit(1);
  
  if(res.length === 0 || !password_verify(password, res[0].password)) {
    return null;
  }

  return { id: res[0].id.toString(), email: res[0].email, name: res[0].name, group: res[0].group }
}

/**
 * Register a new user
 * @returns 1 if the user is registered successfully
 */
export async function registerUser(email: string | null, password: string | null, name: string | null, surname: string | null, schoolId: string | null) {
  if(!email || !password || !name || !surname || !schoolId) {
    throw new Error("Missing parameters");
  }
  const hashedPassword = bcrypt.hashSync(password, 0);
  try {
    const res = await db.insert(users).values({email: email, password: hashedPassword, name: name, surname: surname, schoolId: Number(schoolId)});
    return res[0].affectedRows;
  } catch (error: any) {
    if(error.code === 'ER_DUP_ENTRY'){
      throw new Error("Account già esistente");
    }
  }
}

// WARNING: Questa funzione non dovrebbe mai essere utilizzata
export async function getUserPermissions(id: number) {
  const perms = await db.select({id: permissions.id, name: permissions.name})
  .from(users)
  .leftJoin(group_permissions, eq(users.groupId, group_permissions.groupId))
  .leftJoin(permissions, eq(group_permissions.permissionId, permissions.id))
  .where(eq(users.id, id));
  if(perms.length === 0) {
    return { id: "", email: "", name: "", permissions: [] };
  }

  const permissionsArray = perms.map(perm => ({ id: perm.id, name: perm.name }));
  return permissionsArray
}

/**
 * Check if a user is in a group 
 * @returns true if user is in the group, false otherwise
 */
export async function isUserInGroupById(user_id: number = -1, group_name: string) {
  const group = await db.select({id: groups.id})
  .from(users)
  .leftJoin(groups, eq(users.groupId, groups.id))
  .where(and(eq(groups.name, group_name), eq(users.id, user_id)))

  if (group.length === 0) {
    return false;
  }
  return true;
}

/**
 * @returns the gorup of a certain user
 */
export async function getUserGroupById(user_id: number) {
  const group = await db.select({id: groups.id, name: groups.name})
  .from(users)
  .leftJoin(groups, eq(users.groupId, groups.id))
  .where(eq(users.id, user_id))
  .limit(1);

  if (group.length === 0) {
    return { id: "", name: ""};
  }
  return { id: group[0].id, name: group[0].name};
}