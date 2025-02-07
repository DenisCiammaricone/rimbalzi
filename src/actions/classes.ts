import { db } from "@/app/lib/db/db";
import { classes } from "@/db/schema/classes";
import { users } from "@/db/schema/users";
import { error } from "console";
import { eq } from "drizzle-orm";

export async function createNewClass(name: string, female_number: number, male_number: number, details: string = "", teacher_id: string){
    const tid = Number(teacher_id);

    //Should never occur since we check the teacher_id in the zod schema
    if(isNaN(tid)) {
        throw error('Invalid teacher id');
    }

    const schoolId = await db.select({ schoolId: users.schoolId }).from(users).where(eq(users.id, tid)).then(res => res[0]?.schoolId);
    if (schoolId === null) {
        throw error('School ID not found for the given teacher ID');
    }
    const res = await db.insert(classes).values({code: name, femaleNumber: female_number, maleNumber: male_number, details: details, teacherId: tid, schoolId: schoolId});
    return res;
}