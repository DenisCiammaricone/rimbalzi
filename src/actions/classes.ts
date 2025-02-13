import { db } from "@/app/lib/db/db";
import { classes } from "@/db/schema/classes";
import { users } from "@/db/schema/users";
import { eq, and } from "drizzle-orm";

export async function createNewClass(grade: string, section: string, female_number: number, male_number: number, details: string = "", teacher_id: string){
    const tid = Number(teacher_id);

    //Should never occur since we check the teacher_id in the zod schema
    if(isNaN(tid)) {
        throw ('Invalid teacher id');
    }

    const schoolId = await db.select({ schoolId: users.schoolId }).from(users).where(eq(users.id, tid)).then(res => res[0]?.schoolId);
    if (schoolId === null) {
        throw ('School ID not found for the given teacher ID');
    }
    const res = await db.insert(classes).values({grade: Number(grade), section: section, femaleNumber: female_number, maleNumber: male_number, details: details, teacherId: tid, schoolId: schoolId});
    return res;
}

export async function getClassesByGradeSectionAndSchool(class_grade: string, class_section: string, school_id: string){
    const res = await db.select().from(classes).where(and(eq(classes.grade, Number(class_grade)), eq(classes.section, class_section), eq(classes.schoolId, Number(school_id))));
    return res[0].id.toString();

}

export async function getClassesByTeacherId(teacher_id: string){
    const tid = Number(teacher_id);

    //Should never occur since we check the teacher_id in the zod schema
    if(isNaN(tid)) {
        throw ('Invalid teacher id');
    }

    const res = await db.select().from(classes).where(eq(classes.teacherId, tid));
    return res;
}