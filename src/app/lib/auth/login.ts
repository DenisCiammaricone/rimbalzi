
import { db } from '@/app/lib/db/db';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema/users';
import bcrypt from 'bcryptjs';

function password_verify(passwordLocal: string, passwordDB: string): boolean {
    if (bcrypt.compareSync(passwordLocal, passwordDB)) {
        return true;
    }
    return false;
}

export async function loginUser(email: string, password: string) {
    const res = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (res.length === 0 || !password_verify(password, res[0].password)) {
        return null;
    }

    return res[0]
}
