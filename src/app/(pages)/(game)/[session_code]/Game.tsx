import { Board, deleteGuessLevel, GameLevels, loadGuessLevel, resetLevel, ResetLevelButton, VerifyLevelButton } from "@/app/(pages)/(game)/[session_code]/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from './styles.module.css'
import Cookies from 'js-cookie';
import { redirect } from "next/dist/server/api-utils";

export function Game({ sequence, isMeasure, maxObstaclesCount, sessionCode }: { sequence: Sequence, isMeasure: boolean, maxObstaclesCount?: number, sessionCode: string }) {
    const [level, setLevel] = useState(0);
    const [levelVerified, setLevelVerified] = useState(Array(10).fill(Number(0)));
    const [levelObstaclesCounter, setLevelObstaclesCounter] = useState(Array(10).fill(Number(0)))
    
    const currLevel = useMemo(() => sequence.levels[level], [sequence,level])

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

    
    useEffect(() => {
        const fetch_data = async () => {
            try{
                const res = await fetch('/api/game/savedGame?session_code=' + sessionCode, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                if(res.status === 200) {
                    const savedGameData = await res.json();
                    let completedLevels = 0;
                    savedGameData.data.forEach((move: any) => {
                        if(move.action === 'ver_lvl') {
                            completedLevels++
                            loadGuessLevel(JSON.parse(move.board))
                            //console.log(JSON.parse(move.board).level, Object.values(JSON.parse(move.board).obstacles).length)
                            setLevelObstaclesCounter((prev) => {
                                let newLevelObstaclesCounter = [...prev]
                                newLevelObstaclesCounter[move.level] = Object.values(JSON.parse(move.board).obstacles).length
                                return newLevelObstaclesCounter
                            })
                            setLevelVerified((prev) => {
                                let newLevels = [...prev];
                                newLevels[move.level] = move.outcome ? 1 : -1
                                return newLevels;
                            })
                        } else if(move.action === 'cln_lvl') {
                            deleteGuessLevel(move.level);
                            setLevelVerified((prev) => {
                                let newLevels = [...prev];
                                newLevels[move.level] = 0;
                                return newLevels;
                            })
                        }
                        console.log("Completed levels: ", completedLevels)
                        if(completedLevels === 10 && isMeasure) {
                            console.log("Redirecting to game over")
                            document.location.href = '/' + sessionCode + '/gameOver'
                        }
                    })

                    // const logRes = await fetch('/api/game/logLoadGame', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify({ session_code: sessionCode })
                    // })
                }
            } catch (error) {
                console.error("Error fetching saved games: ", error)
            }
        }

        fetch_data();
    }, [sessionCode])

    return (
        <div id={styles.game} className="flex flex-col items-center">
            <div>
                <h1>Rimbalzi</h1>
                <h2>Livello {currLevel.level}</h2>
            </div>
            { /* ShowPreview deve essere true solo se si vuole mostrare il vero posizionamento degli ostacoli */ }
            <Board level={currLevel} is_measure={isMeasure} is_verified={levelVerified[currLevel.level - 1] === 0 ? false : true} showPreview={false} session_code={sessionCode} levelObstaclesCounter={levelObstaclesCounter} setLevelObstaclesCounter={setLevelObstaclesCounter} maxObstaclesCount={maxObstaclesCount}/>
            <div className="flex flex-row gap-4">
                <ResetLevelButton currentLevel={Number(currLevel.level)} sessionCode={sessionCode} isMeasure={isMeasure} levelVerified={levelVerified} setLevelObstaclesCounter={setLevelObstaclesCounter}></ResetLevelButton>
                <VerifyLevelButton lvlNumber={Number(currLevel.level)} sessionCode={sessionCode} isMeasure={isMeasure} levelVerified={levelVerified} setLevelVerified={setLevelVerified} levelObstaclesCounter={levelObstaclesCounter} maxObstaclesCount={maxObstaclesCount} setLevel={setLevel}/>
            </div>
            <GameLevels setLevel={setLevel} level={level} levelVerified={levelVerified} sessionCode={sessionCode} isMeasure={isMeasure}/>
        </div>
    )
}