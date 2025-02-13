import { db } from "@/app/lib/db/db";
import { sessions } from "@/db/schema/sessions";
import { getClassesByGradeSectionAndSchool } from "./classes";
import { getTeacherSchoolId } from "./user";
import { session_phases } from "@/app/lib/enums";
import { eq, and } from "drizzle-orm";

export async function createNewSession(class_grade: string, class_section: string, session_phase: string, teacher_id: string, details: string = ""){ 
    const school_id = await getTeacherSchoolId(teacher_id);
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
    const res = await db.insert(sessions).values({phase: session_phase, code: code, details: details, userId: Number(teacher_id), classId: Number(classId)});
    return res;
}

async function classSessionPhaseAlreadyExists(teacher_id: string, class_id: string, session_phase: string) {
    const res = await db.select().from(sessions).where(and(eq(sessions.userId, Number(teacher_id)), eq(sessions.classId, Number(class_id)), eq(sessions.phase, session_phase)))
    if (res.length > 0) { return true}
    return false
}