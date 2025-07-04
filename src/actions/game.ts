import { db } from "@/lib/db/db";
import { games } from "@/db/schema/games";
import { session_sequences } from "@/db/schema/session_sequences";
import { sessionKeys } from "@/db/schema/sessionKeys";
import { sessions } from "@/db/schema/sessions";
import { eq, and, sql, desc, asc } from "drizzle-orm"
import { getPupilIdByCode, getSessionIdByCode } from "./sessions";
import { changeLevelLogs } from "@/db/schema/logs_changeLevel";
import { verifyLevelLogs } from "@/db/schema/logs_verifyLevels";
import { cellModLogs } from "@/db/schema/logs_cellModify";
import { cleanLevelLogs } from "@/db/schema/logs_cleanLevel";
import { releaseShotLogs } from "@/db/schema/logs_releaseShot";
import { loadGameLogs } from "@/db/schema/logs_loadGame";

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
        if(typeof (res[0].sequence) === 'string') {
            return JSON.parse(res[0].sequence) as Sequence;
        }
        //return res[0].sequence as Sequence; // Prima non cera as Sequence e Promise<Sequence> non era necessario
        return {} as Sequence; // Prima non cera as Sequence e Promise<Sequence> non era necessario
    } catch (error: any) {
        throw new Error("Errore nel recupero della sequenza" + error.toString());
    }
}

function negateDirection(direction: 'ltr' | 'rtl' | 'utd' | 'dtu'): string {
    switch (direction) {
        case 'ltr':
            return 'rtl';
        case 'rtl':
            return 'ltr';
        case 'utd':
            return 'dtu';
        case 'dtu':
            return 'utd';
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

export async function getLevelMask(level: Level): Promise<[string, string][]> {
    let mask: [string,string][] = []
    let output: string = ""
    let input: string
    let ballPosition: [number, number]
    let direction: string
    for(let i = 1; i <= level.size; i++) {
        for (const dir of ['ltr', 'rtl', 'utd', 'dtu']) {
            input = `${dir}_${i}`;
            let res = checkOutputArrow(input, level);
            ballPosition = res[0];
            direction = res[1];
            if (direction === 'ltr' || direction === 'rtl') {
                output = negateDirection(direction) + "_" + ballPosition[0];
            } else if (direction === 'utd' || direction === 'dtu') {
                output = negateDirection(direction) + "_" + ballPosition[1];
            }

            // Aggiunge la coppia (input, output) alla maschera se e solo se non è già presente
            if (!mask.some(([a, b]) => (a === input && b === output) || (a === output && b === input))) {
                mask.push([input, output]);
            }
        }
    }
    return mask
}

export async function isLevelMaskSuccess(a_mask: [string,string][], b_mask: [string,string][]): Promise<boolean> {
    if (a_mask.length !== b_mask.length) {
        return false;
    }
    for(const [a,b] of a_mask) {
        if (!b_mask.some(([c,d]) => (a === c && b === d) || (a === d && b === c))) {
            return false;
        }
    }
    return true;

}


// ? Questa funzione è ridondate dato che gira serverside e clientsize. E' possibilie evitare di scriverla due volte?
function checkOutputArrow(inputArrow: string, level: Level): [[number, number], string] {
    const parts = inputArrow.split('_'); // direction and index
    const index = parseInt(parts[1]); // colun or row from where the ball is thrown
    let direction = parts[0];
    let ballPosition: [number, number] = [0, 0]; // [row, col]

    switch (direction) {
        case 'ltr':
            ballPosition = [index, 1];
            break;
        case 'rtl':
            ballPosition = [index, level.size];
            break;
        case 'utd':
            ballPosition = [1, index];
            break;
        case 'dtu':
            ballPosition = [level.size, index];
            break;
    }

    // Until the ball is inside the board
    while (ballPosition[0] >= 1 && ballPosition[0] <= level.size && ballPosition[1] >= 1 && ballPosition[1] <= level.size) {
        const obstacle = level.obstacles[ballPosition[0] + "_" + ballPosition[1]];
        switch (direction) {
            case 'ltr':
                if (obstacle === '\\') {
                    direction = 'utd';
                    ballPosition[0]++;
                } else if (obstacle === '/') {
                    direction = 'dtu';
                    ballPosition[0]--;
                } else {
                    ballPosition[1]++;
                }
                break;
            case 'rtl':
                if (obstacle === '\\') {
                    direction = 'dtu';
                    ballPosition[0]--;
                } else if (obstacle === '/') {
                    direction = 'utd';
                    ballPosition[0]++;
                } else {
                    ballPosition[1]--;
                }
                break;
            case 'utd':
                if (obstacle === '\\') {
                    direction = 'ltr';
                    ballPosition[1]++;
                } else if (obstacle === '/') {
                    direction = 'rtl';
                    ballPosition[1]--;
                } else {
                    ballPosition[0]++;
                }
                break;
            case 'dtu':
                if (obstacle === '\\') {
                    direction = 'rtl';
                    ballPosition[1]--;
                } else if (obstacle === '/') {
                    direction = 'ltr';
                    ballPosition[1]++;
                } else {
                    ballPosition[0]--;
                }
                break;
        }
    }

    return [ballPosition, direction];
}

export async function createSessionKeyLogRecord(pupil_code: string, session_code: string) {
    try {
        const sessionId = await getSessionIdByCode(session_code);
        const res = await db.select({id: games.id}).from(games).where(and(eq(games.sessionId, sessionId), eq(games.sessionKey, pupil_code)));
        if (res.length > 0) {
            return;
        }
        await db.insert(games).values({sessionId: sessionId, sessionKey: pupil_code, moves: '[]'});
    } catch (error: any) {
        throw new Error("Errore nella creazione del record di log della chiave di sessione" + error.toString());
    }
}

export async function logLevelSwitch(from: number, to: number, session_code: string, pupil_code: string) {
    try {
        const sessionId = await getSessionIdByCode(session_code);
        const pupilId = await getPupilIdByCode(pupil_code, sessionId);
        //const res = await db.update(games).set({movesCount: sql`${games.movesCount} + 1`}).where(and(eq(games.sessionId, sessionId), eq(games.sessionKey, pupil_code)));
        await db.insert(changeLevelLogs).values({session_id: sessionId, pupil_id: pupilId, level: from, to: to});
        const res = await db.execute(sql`UPDATE games SET moves = JSON_ARRAY_APPEND(moves, '$', JSON_OBJECT('action', 'chg_lvl', 'from', ${from}, 'to', ${to}, 'timestamp', ${new Date()})) WHERE session_id = ${sessionId} AND session_key = ${pupil_code}`);
    } catch (error: any) {
        throw new Error("Errore nel log del cambio di livello" + error.toString());
    }
}

export async function logLevelVerify(level_num: number, outcome: boolean, level: Level, session_code: string, pupil_code: string) {
    try {
        const sessionId = await getSessionIdByCode(session_code);
        const pupilId = await getPupilIdByCode(pupil_code, sessionId);

        await db.insert(verifyLevelLogs).values({session_id: sessionId, pupil_id: pupilId, level: level_num, board: JSON.stringify(level), outcome: outcome});
        const res = await db.execute(sql`UPDATE games SET moves = JSON_ARRAY_APPEND(moves, '$', JSON_OBJECT('action', 'ver_lvl', 'level', ${level_num}, 'outcome', ${outcome}, 'board', ${JSON.stringify(level)}, 'timestamp', ${new Date()})) WHERE session_id = ${sessionId} AND session_key = ${pupil_code}`);
    } catch (error: any) {
        throw new Error("Errore nel log della verifica di livello" + error.toString());
    }
}

export async function logChangeCellObstacle(level_num: number, x: number, y: number, starting_obstacle: string, new_obstacle: string, session_code: string, pupil_code: string) {
    try {
        const sessionId = await getSessionIdByCode(session_code);
        const pupilId = await getPupilIdByCode(pupil_code, sessionId);

        await db.insert(cellModLogs).values({session_id: sessionId, pupil_id: pupilId, level: level_num, x: x, y: y, startingObstacle: starting_obstacle, newObstacle: new_obstacle});
        const res = await db.execute(sql`UPDATE games SET moves = JSON_ARRAY_APPEND(moves, '$', JSON_OBJECT('action', 'mod_cel', 'level', ${level_num}, 'x', ${x}, 'y', ${y}, 'starting_obstacle', ${starting_obstacle}, 'new_obstacle', ${new_obstacle}, 'timestamp', ${new Date()})) WHERE session_id = ${sessionId} AND session_key = ${pupil_code}`);
    } catch (error: any) {
        throw new Error("Errore nel log del cambio di cella" + error.toString());
    }
}

export async function logResetLevel (level_num: number, session_code: string, pupil_code: string) {
    try {
        const sessionId = await getSessionIdByCode(session_code);
        const pupilId = await getPupilIdByCode(pupil_code, sessionId);

        await db.insert(cleanLevelLogs).values({session_id: sessionId, pupil_id: pupilId, level: level_num});
        const res = await db.execute(sql`UPDATE games SET moves = JSON_ARRAY_APPEND(moves, '$', JSON_OBJECT('action', 'cln_lvl', 'level', ${level_num}, 'timestamp', ${new Date()})) WHERE session_id = ${sessionId} AND session_key = ${pupil_code}`);
    } catch (error: any) {
        throw new Error("Errore nel log del reset di livello" + error.toString());
    }
}

export async function logReleaseShot(level_num: number, from: string, to: string, session_code: string, pupil_code: string) {
    try {
        const sessionId = await getSessionIdByCode(session_code);
        const pupilId = await getPupilIdByCode(pupil_code, sessionId);

        await db.insert(releaseShotLogs).values({session_id: sessionId, pupil_id: pupilId, level: level_num, from: from, to: to});
        const res = await db.execute(sql`UPDATE games SET moves = JSON_ARRAY_APPEND(moves, '$', JSON_OBJECT('action', 'rel_sht', 'from', ${from}, 'to', ${to}, 'level', ${level_num}, 'timestamp', ${new Date()})) WHERE session_id = ${sessionId} AND session_key = ${pupil_code}`);
    } catch (error: any) {
        throw new Error("Errore nel log del cambio di livello" + error.toString());
    }
}

export async function logLoadGame(session_code: string, pupil_code: string) {
    try {
        const sessionId = await getSessionIdByCode(session_code);
        const pupilId = await getPupilIdByCode(pupil_code, sessionId);

        await db.insert(loadGameLogs).values({session_id: sessionId, pupil_id: pupilId});
        const res = await db.execute(sql`UPDATE games SET moves = JSON_ARRAY_APPEND(moves, '$', JSON_OBJECT('action', 'load', 'timestamp', ${new Date()})) WHERE session_id = ${sessionId} AND session_key = ${pupil_code}`);
    } catch (error: any) {
        throw new Error("Errore nel log del caricamento di partita" + error.toString());
    }
}

export async function isSessionMeasure(session_code: string) {
    try { 
        const sessionId = await getSessionIdByCode(session_code);
        const res = await db.select({phase: sessions.phase}).from(sessions).where(eq(sessions.id, sessionId));
        if(res[0].phase === 'test1' || res[0].phase === 'test2') {
            return true;
        }
    } catch(error: any) {
        throw new Error("Errore nel recupero della fase della sessione" + error.toString());
    }

    return false;
}

export async function getPupilGameData(session_code: string, pupil_code: string) {
    try {
        const sessionId = await getSessionIdByCode(session_code);
        const res = await db.select({moves: games.moves}).from(games).where(and(eq(games.sessionId, sessionId), eq(games.sessionKey, pupil_code)));
        
        // This is to prevent problems with different DB (local: mysql, remote: mariadb)
        if(typeof (res[0].moves) === 'string') {
            return JSON.parse(res[0].moves);
        }
        
        return res[0].moves; 
    } catch (error: any) {
        throw new Error("Errore nel recupero dei dati della sessione" + error.toString());
    }
}

export async function getLevelsOutcomeForSession(session_code: string) {
    try {
        const sessionId = await getSessionIdByCode(session_code);
        const res = await db.select({moves: games.moves, sessionKey: games.sessionKey}).from(games).where(eq(games.sessionId, sessionId));

        let correctLevels: Record<string, {level: number, success: boolean}[]> = {}
        res.map((game) => {
            const moves = typeof game.moves === 'string' ? JSON.parse(game.moves) : game.moves;
            moves.map((move: any) => {
                if(move.action === 'ver_lvl') {
                    if (correctLevels[game.sessionKey] === undefined) {
                        correctLevels[game.sessionKey] = [{level: move.level, success: move.outcome}];
                    } else {
                        correctLevels[game.sessionKey].push({level: move.level, success: move.outcome});
                    }
                }
            })
        })
        // res.map((game) => {
        //     const moves = typeof game.moves === 'string' ? JSON.parse(game.moves) : game.moves;
        //     (moves as any[]).map((move: any) => {
        //         if(move.action === 'ver_lvl' && move.outcome === true) {
        //             if (correctLevels[game.sessionKey] === undefined) {
        //                 correctLevels[game.sessionKey] = [move.level];
        //             } else {
        //                 correctLevels[game.sessionKey].push(move.level);
        //             }
        //         }
        //     })
        // })

        return correctLevels;
    } catch (error: any) {
        throw new Error("Errore nel recupero dei livelli corretti per la sessione" + error.toString());
    }
}

/**
 * 
 * @param pupil_code 
 * @param sesssion_code 
 * @returns millis between start and finish time of the session
 */
export async function getPupilFinishTime(pupil_code: string, sesssion_code: string) {
    try {
        const sessionId = await getSessionIdByCode(sesssion_code);
        const pupilId = await getPupilIdByCode(pupil_code, sessionId);
        let startTimeRes = await db.select({startTime: loadGameLogs.timestamp}).from(loadGameLogs).where(and(eq(loadGameLogs.session_id, sessionId), eq(loadGameLogs.pupil_id, pupilId))).limit(1).orderBy(asc(loadGameLogs.timestamp));
        let finishTimeRes = await db.select({finishTime: verifyLevelLogs.timestamp}).from(verifyLevelLogs).where(and(eq(verifyLevelLogs.session_id, sessionId), eq(verifyLevelLogs.pupil_id, pupilId))).limit(1).orderBy(desc(verifyLevelLogs.timestamp));
        return finishTimeRes[0].finishTime.getTime() - startTimeRes[0].startTime.getTime();
    } catch (error: any) {
        throw new Error("Errore nel recupero del tempo di completamento della sessione" + error.toString());
    }
}