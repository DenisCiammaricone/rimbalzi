import { db } from "@/app/lib/db/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs';

function password_verify(passwordLocal: string, passwordDB: string): boolean {
    if (bcrypt.compareSync(passwordLocal, passwordDB)) {
        return true;
    }
    return false;
}

export async function getUserFromDb(email: string, password: string) {
  const res = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if(res.length === 0 || !password_verify(password, res[0].password)) {
    return { id: "", email: "", name: "" };
  }

  return { id: res[0].id, email: res[0].email, name: res[0].name }
}