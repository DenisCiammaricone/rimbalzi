import { db } from "@/lib/db/db";
import { sessions } from "@/db/schema/sessions";
import { getClassById, getClassesByGradeSectionAndSchool } from "./classes";
import { getTeacherSchoolId } from "./users";
import { session_phases, session_states } from "@/lib/enums";
import { eq, and } from "drizzle-orm";
import { classes } from "@/db/schema/classes";
import { sessionKeys } from "@/db/schema/sessionKeys";
import { session_sequences } from "@/db/schema/session_sequences";
import { default_sequences } from "@/db/schema/default_sequences";

/**
 * Create a new session
 * @returns id of the just created session
 */
export async function createNewSession(class_grade: string, class_section: string, session_phase: string, teacher_id: string, details: string = "") {
    const school_id = await getTeacherSchoolId(Number(teacher_id));
    if (!school_id) {
        throw "School ID is undefined";
    }

    const classId = await getClassesByGradeSectionAndSchool(class_grade, class_section, school_id.toString());
    if (!session_phases.includes(session_phase)) {
        throw "Invalid session phase";
    }

    let code: string;
    let exists: any;
    do {
        // TODO: Review the following line? Autogeneration does things
        code = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generates a 6-char alphanumeric code
        exists = await db.select().from(sessions).where(eq(sessions.code, code)).limit(1);
    } while (exists.length > 0);

    if (await classSessionPhaseAlreadyExists(teacher_id, classId, session_phase)) {
        //console.log("Class already has a session in this phase: ", session_phase);
        throw "Class already has a session in this phase"
    }

    const default_sequence = await getSessionDefaultSequenceCode(Number(class_grade), session_phase);
    console.log("Default sequence: ", default_sequence);
    try {
        //TODO: Sequence Id should be assigned based on the phase and class
        const res = await db.insert(sessions).values({ phase: session_phase, code: code, details: details, userId: Number(teacher_id), classId: Number(classId), sequenceId: default_sequence }).$returningId().execute();
        return res[0].id;
    } catch (error: any) {
        throw new Error(error);
    }
}

/**
 * Update a session
 * @returns 1 if the session is updated
 */
export async function updateSession(teacher_id: string, class_id: string, session_code: string, session_phase: string, details: string, old_session_phase: string) {
    if (!session_phases.includes(session_phase)) {
        throw new Error("Invalid session phase");
    }
    // TODO: Rewrite the followind query in another fuction?
    try {
        const q = await db.select().from(sessions).where(and(eq(sessions.userId, Number(teacher_id)), eq(sessions.classId, Number(class_id)), eq(sessions.phase, old_session_phase))).limit(1);

        // Checks if a certain class already has a session in the same phase
        if (q && q[0].code != session_code && await classSessionPhaseAlreadyExists(teacher_id, class_id, session_phase)) {
            throw new Error("Class already has a session in this phase")
        }
    } catch (error: any) {
        throw new Error(error);
    }

    try {
        const res = await db.update(sessions).set({ phase: session_phase, details: details }).where(eq(sessions.code, session_code)).execute();
        return res[0].affectedRows;
    } catch (error: any) {
        throw new Error(error);
    }
}

/**
 * Delete a session
 * @param session_code code of the session to delete
 * @returns 1 if the session is deleted
 */
export async function deleteSession(session_code: string) {
    try {
        const res = await db.delete(sessions).where(eq(sessions.code, session_code));
        return res[0].affectedRows;
    } catch (error: any) {
        if (error.errno === 1451 || error.errno === 1216) {
            throw new Error('La sessione ha partite associate, non può essere eliminata...');
        }
        throw error;
    }
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
        insert.push({ sex: 'F', sessionId: Number(sessionId) });
    }
    for (let i = 0; i < classDetails.maleNumber; i++) {
        insert.push({ sex: 'M', sessionId: Number(sessionId) });
    }
    const result = await db.insert(sessionKeys).values(insert);
    return result;
}

/**
 * Get all sessions of a teacher
 * @param teacher_id id of the teacher to get the sessions
 * @returns all sessions of the teacher
 */
export async function getSessionsByTeacherId(teacher_id: string) {
    const tid = Number(teacher_id);

    //Should never occur since we check the teacher_id in the zod schema
    if (isNaN(tid)) {
        throw ('Invalid teacher id');
    }

    const res = await db.select({ id: sessions.id, state: sessions.state, code: sessions.code, phase: sessions.phase, details: sessions.details, class_grade: classes.grade, class_section: classes.section, class_id: classes.id }).from(sessions).leftJoin(classes, eq(classes.id, sessions.classId)).where(eq(sessions.userId, tid));

    return res;
}

/**
 * Get all sessions
 * @returns all sessions
 */
export async function getAllSessions() {
    const res = await db.select({ 
        id: sessions.id, 
        state: sessions.state, 
        code: sessions.code, 
        phase: sessions.phase, 
        details: sessions.details, 
        class_grade: classes.grade, 
        class_section: classes.section, 
        class_id: classes.id,
        sequence_id: sessions.sequenceId
    }).from(sessions)
    .leftJoin(classes, eq(classes.id, sessions.classId));

    return res;
}

/**
 * Update a session's sequence ID
 * @param session_id id of the session to update
 * @param sequence_id new sequence ID
 * @returns 1 if the session is updated
 */
export async function updateSessionSequenceId(session_id: string, sequence_id: string) {
    try {
        const result = await db.update(sessions)
            .set({ sequenceId: Number(sequence_id) })
            .where(eq(sessions.id, Number(session_id)))
            .execute();
        return result[0].affectedRows;
    } catch (error: any) {
        throw new Error(error);
    }
}

/**
 * Get all session sequences
 * @returns all session sequences
 */
export async function getAllSessionSequences() {
    try {
        const res = await db.select().from(session_sequences);
        return res;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getSessionIdByCode(code: string) {
    try {
        const res = await db.select({ id: sessions.id }).from(sessions).where(eq(sessions.code, code));
        return res[0].id;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getPupilIdByCode(pupil_code: string, session_id: number) {
    try {
        const res = await db.select({ id: sessionKeys.id }).from(sessionKeys).where(and(eq(sessionKeys.sessionId, session_id), eq(sessionKeys.key, pupil_code)));
        return res[0].id;
    } catch (error: any) {
        throw new Error(error);
    }
}

/**
 * Check if a session phase already exists for a class
 * @returns true if the session phase already exists else otherwise
 */
async function classSessionPhaseAlreadyExists(teacher_id: string, class_id: string, session_phase: string) {
    const res = await db.select().from(sessions).where(and(eq(sessions.userId, Number(teacher_id)), eq(sessions.classId, Number(class_id)), eq(sessions.phase, session_phase)))
    if (res.length > 0) { return true }
    return false
}

export async function startSession(session_id: string) {
    const res = await db.select({ startedAt: sessions.startedAt }).from(sessions).where(eq(sessions.id, Number(session_id)));
    if(res[0].startedAt) {
        throw new Error("Session already started");
    }
    const result = await db.update(sessions).set({ startedAt: new Date(), state: session_states[1] }).where(eq(sessions.id, Number(session_id)));
    return result;
}

export async function endSession(session_id: string) {
    const result = await db.update(sessions).set({ endedAt: new Date(), state: session_states[2] }).where(eq(sessions.id, Number(session_id)));
    return result
}

export async function isTeacherOwnerOfSession(teacher_id: string, session_code: string) {
    const res = await db.select().from(sessions).where(and(eq(sessions.userId, Number(teacher_id)), eq(sessions.code, session_code)));
    if(res.length > 0) {
        return true;
    }
    return false;
}

export async function getSessionKeys(session_code: string) {
    const session_id = await getSessionIdByCode(session_code);
    const res = await db.select().from(sessionKeys).where(eq(sessionKeys.sessionId, Number(session_id)));
    return res;
}

// ! Deprecated function... use getSessionStatus instead
export async function isSessionStarted(session_code: string) {
    const res = await db.select({ startedAt: sessions.startedAt }).from(sessions).where(eq(sessions.code, session_code));
    if(res[0].startedAt) {
        return true;
    }
    return false;
}


// ! Deprecated function... use getSessionStatus instead
export async function isSessionFinished(session_code: string) {
    const res = await db.select({ startedAt: sessions.startedAt }).from(sessions).where(eq(sessions.code, session_code));
    if(res[0].startedAt) {
        return true;
    }
    return false;
}

export async function getSessionStatus(session_code: string) {
    const res = await db.select({ state: sessions.state }).from(sessions).where(eq(sessions.code, session_code));
    return res[0].state;
}

export async function getSessionDefaultSequenceCode(grade: number, phase: string) {
    const res = await db.select({ id: default_sequences.sequenceId }).from(default_sequences).where(and(eq(default_sequences.grade, grade), eq(default_sequences.phase, phase))).limit(1);
    if(res.length === 0) {
        throw new Error("Default sequence not found");
    }
    return res[0].id;
}