import { db } from "@/app/lib/db/db";
import { schools } from "@/db/schema/schools";

export async function getAllSchoolsId() {
    const res = await db.select({id: schools.id, name: schools.name }).from(schools);
    return res;
}