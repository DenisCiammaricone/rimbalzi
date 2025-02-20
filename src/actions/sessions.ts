import { db } from "@/app/lib/db/db";
import { sessions } from "@/db/schema/sessions";
import { getClassById, getClassesByGradeSectionAndSchool } from "./classes";
import { getTeacherSchoolId } from "./user";
import { session_phases } from "@/app/lib/enums";
import { eq, and } from "drizzle-orm";
import { classes } from "@/db/schema/classes";
import { sessionKeys } from "@/db/schema/sessionKeys";

export async function createNewSession(class_grade: string, class_section: string, session_phase: string, teacher_id: string, details: string = ""){ 
    const school_id = await getTeacherSchoolId(Number(teacher_id));
    if (!school_id) {
        throw "School ID is undefined";
    }

    const classId = await getClassesByGradeSectionAndSchool(class_grade, class_section, school_id.toString());
    if(!session_phases.includes(session_phase)) {
        throw "Invalid session phase";
    }

    let code: string;
    let exists: any;
    do {
        code = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generates a 6-char alphanumeric code
        exists = await db.select().from(sessions).where(eq(sessions.code, code)).limit(1);
    } while (exists.length > 0); 

    if( await classSessionPhaseAlreadyExists(teacher_id, classId, session_phase) ) {
        throw "Class already has a session in this phase"
    }
    const res = await db.insert(sessions).values({phase: session_phase, code: code, details: details, userId: Number(teacher_id), classId: Number(classId)}).$returningId().execute();
    return res[0].id;
}

/***
 * This function generates n session keys for a given session id
 * n is the number of male students + the number of female students
 * eache key in the database has to refer to the student sex
 * @param sessionId The session id for which the keys are to be generated
 * @param classId The class for wich the session is being created
 */
export async function createSessionKeys(sessionId: string, classId: string) {
    let insert = [];
    const classDetails = await getClassById(classId);
    for (let i = 0; i < classDetails.femaleNumber; i++) {
        insert.push({sex: 'F', sessionId: Number(sessionId)});
    }
    for (let i = 0; i < classDetails.maleNumber; i++) {
        insert.push({sex: 'M', sessionId: Number(sessionId)});
    }
    const result = await db.insert(sessionKeys).values(insert);
    return result;
}

export async function getSessionsByTeacherId(teacher_id: string) {
    const tid = Number(teacher_id);

    //Should never occur since we check the teacher_id in the zod schema
    if(isNaN(tid)) {
        throw ('Invalid teacher id');
    }

    const res = await db.select({id: sessions.id, code: sessions.code, phase: sessions.phase, details: sessions.details, class_grade: classes.grade, class_section: classes.section}).from(sessions).leftJoin(classes, eq(classes.id, sessions.classId)).where(eq(sessions.userId, tid));

    return res;
}

async function classSessionPhaseAlreadyExists(teacher_id: string, class_id: string, session_phase: string) {
    const res = await db.select().from(sessions).where(and(eq(sessions.userId, Number(teacher_id)), eq(sessions.classId, Number(class_id)), eq(sessions.phase, session_phase)))
    if (res.length > 0) { return true}
    return false
}