import { db } from "@/app/lib/db/db";
import { session_sequences } from "@/db/schema/session_sequences";
import { sessionKeys } from "@/db/schema/sessionKeys";
import { sessions } from "@/db/schema/sessions";
import { eq, and } from "drizzle-orm"

export async function isSessionCodeValid(code: string) {
    const res = await db.select({ id: sessions.id }).from(sessions).where(eq(sessions.code, code));
    return res.length > 0;
}

export async function getSessionTeacher(session_id: string) {
    const res = await db.select({ teacher_id: sessions.userId }).from(sessions).where(eq(sessions.code, session_id));
    return res[0].teacher_id;
}

export async function doesPupilExistsForSession(pupil_code: string, session_code: string) {

    const res = await db.select({ id: sessionKeys.sessionId }).from(sessionKeys).leftJoin(sessions, eq(sessions.id, sessionKeys.sessionId)).where(and(eq(sessionKeys.key, pupil_code), eq(sessions.code, session_code)))
    return res.length > 0;
}

export async function getSequence(session_code: string) : Promise<Sequence> {
    try {
        const res = await db.select({ sequence: session_sequences.sequences }).from(session_sequences).leftJoin(sessions, eq(sessions.sequenceId, session_sequences.id)).where(eq(sessions.code, session_code));
        return res[0].sequence as Sequence; // Prima non cera as Sequence e Promise<Sequence> non era necessario
    } catch (error: any) {
        throw new Error("Errore nel recupero della sequenza" + error.toString());
    }
}

export async function isLevelSuccess(session_code: string, level: Level): Promise<boolean> {
    const sequence = await getSequence(session_code);
    let obstacle = undefined
    for(const key in sequence.levels[level.level - 1].obstacles) {
        if (level.obstacles[key] === undefined) {
            obstacle = ''
        } else{
            obstacle = level.obstacles[key]
        }
        if(obstacle !== sequence.levels[level.level - 1].obstacles[key]) {
            return false;
        }
    }
    return true;
}