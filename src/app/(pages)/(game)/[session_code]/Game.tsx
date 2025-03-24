import { Board, GameLevels, resetLevel, VerifyLevelButton } from "@/app/(pages)/(game)/[session_code]/core";
import { useEffect, useState } from "react";
import styles from './styles.module.css'
import Cookies from 'js-cookie';

export function Game({ sequence, isMeasure, sessionCode }: { sequence: Sequence, isMeasure: boolean, sessionCode: string }) {
    const [level, setLevel] = useState(0);
    const [levelVerified, setLevelVerified] = useState(Array(10).fill(false));
    const [levelStatus, setLevelStatus] = useState(Array(10).fill(false));
    
    
    // TODO: Cancellare i cookies 'guess' ogni volta che si fa il login da pupil in una sessione
    // Inizializza il guess nei cookies
    if(Cookies.get('guess') === undefined) {
        let emptySequence: Sequence = {
            levels: Array.from({ length: 10 }, (_, index) => ({
                level: index + 1,
                size: 0, // or any appropriate size value
                obstacles: {}
            }))
        }
        Cookies.set('guess', JSON.stringify(emptySequence));
    }

    // useEffect(() => {
    //      const verifySeq = async () => {
    //          const verifiedSeq = await verifySequence(sessionCode)
    //          setLevelStatus(verifiedSeq)
    //      }
    //      verifySeq();
    // }, [])

    let currLevel = sequence.levels[level];
    useEffect(() => {
        currLevel = sequence.levels[level];
    }, [level, levelStatus])

    return (
        <div id={styles.game} className="flex flex-col items-center">
            <h1>Rimbalzi</h1>
            { /* ShowPreview deve essere true solo se si vuole mostrare il vero posizionamento degli ostacoli */ }
            <Board level={currLevel} showPreview={false} session_code={sessionCode} />
            <div className="flex flex-row gap-4">
                <button className={styles.gameButton + ' ' + styles.negative} onClick={() => resetLevel(currLevel.level, sessionCode)}>Reset</button>
                <VerifyLevelButton lvlNumber={Number(currLevel.level)} sessionCode={sessionCode} setLevelStatus={setLevelStatus} isMeasure={isMeasure} levelVerified={levelVerified} setLevelVerified={setLevelVerified}/>
            </div>
            <GameLevels setLevel={setLevel} level={level} setLevelStatus={setLevelStatus} levelStatus={levelStatus} sessionCode={sessionCode}/>
        </div>
    )
}