import { db } from "@/app/lib/db/db";
import { classes } from "@/db/schema/classes";
import { users } from "@/db/schema/users";
import { eq, and } from "drizzle-orm";

/**
 * Create a new class
 * @returns 1 if the class was created
 */
export async function createNewClass(grade: string, section: string, female_number: number, male_number: number, details: string = "", teacher_id: string) {
    const tid = Number(teacher_id);

    //Should never occur since we check the teacher_id in the zod schema
    if (isNaN(tid)) {
        throw ('Invalid teacher id');
    }

    const schoolId = await db.select({ schoolId: users.schoolId }).from(users).where(eq(users.id, tid)).then(res => res[0]?.schoolId);
    if (schoolId === null) {
        throw ('School ID not found for the given teacher ID');
    }

    try {
        const res = await db.insert(classes).values({ grade: Number(grade), section: section, femaleNumber: female_number, maleNumber: male_number, details: details, teacherId: tid, schoolId: schoolId });
        return res[0].affectedRows;
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('La classe già esiste nella base dati');
        }
    }
}

/**
 * Delete a class
 * @param classId id of the class to delete
 * @returns 1 if the class is deleted
 */
export async function deleteClass(classId: string) {
    try {
        const res = await db.delete(classes).where(eq(classes.id, Number(classId)));
        return res[0].affectedRows;
    } catch (error: any) {
        if (error.errno === 1451 || error.errno === 1216) {
            throw new Error('La classe ha sessioni associate, non può essere eliminata...');
        }
        throw new Error(error);
    }
}

/**
 * Update a class
 * @param class_id id of the class to update
 * @returns 1 if the class is updated
 */
export async function updateClass(class_id: string, maleNumber: number, femaleNumber: number, details: string) {
    try {
        const res = await db.update(classes)
            .set({
                maleNumber: maleNumber,
                femaleNumber: femaleNumber,
                details: details
            })
            .where(eq(classes.id, Number(class_id)));
        return res[0].affectedRows;
    } catch (error: any) {
        throw new Error('Errore durante l\'aggiornamento della classe');
    }
}

/**
 * TODO: Make it return a Class defined in the interface file
 * Get class by unique tuple (grade, section, school_id)
 * @returns Id of the class you were looking for
 */
export async function getClassesByGradeSectionAndSchool(class_grade: string, class_section: string, school_id: string) {
    const res = await db.select().from(classes).where(and(eq(classes.grade, Number(class_grade)), eq(classes.section, class_section), eq(classes.schoolId, Number(school_id))));
    return res[0].id.toString();
}

/**
 * Get all classes of a teacher
 * @param teacher_id id of the teacher you want to get the classes of
 * @returns Array of classes
 */
export async function getClassesByTeacherId(teacher_id: string) {
    const tid = Number(teacher_id);

    //Should never occur since we check the teacher_id in the zod schema
    if (isNaN(tid)) {
        throw new Error('Invalid teacher id');
    }

    try {
        const res = await db.select().from(classes).where(eq(classes.teacherId, tid));
        return res;
    } catch (error: any) {
        throw new Error('Errore durante il recupero delle classi');
    }
}

/**
 * TODO: Make it return a Class defined in the interface file
 * Get a class by its id
 * @param classId id of the class you want to get
 * @returns all the class data
 */
export async function getClassById(classId: string) {
    try {
        const res = await db.select().from(classes).where(eq(classes.id, Number(classId)));
        return res[0];
    } catch (error: any) {
        throw new Error('Errore durante il recupero della classe');
    }
}