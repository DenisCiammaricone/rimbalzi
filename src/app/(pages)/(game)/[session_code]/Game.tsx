import { Board, deleteGuessLevel, GameLevels, loadGuessLevel, resetLevel, ResetLevelButton, VerifyLevelButton } from "@/app/(pages)/(game)/[session_code]/core";
import { useEffect, useState } from "react";
import styles from './styles.module.css'
import Cookies from 'js-cookie';

export function Game({ sequence, isMeasure, sessionCode }: { sequence: Sequence, isMeasure: boolean, sessionCode: string }) {
    const [level, setLevel] = useState(0);
    const [levelVerified, setLevelVerified] = useState(Array(10).fill(Number(0)));
    
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
            const savedGame = await fetch('/api/game/savedGame?session_code=' + sessionCode, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if(savedGame.status === 200) {
                const savedGameData = await savedGame.json();
                
                savedGameData.data.map((move: any) => {
                    
                    if(move.action === 'ver_lvl') {
                        loadGuessLevel(JSON.parse(move.board))
                        setLevelVerified((prev) => {
                            let newLevels = [...prev];
                            if(move.outcome ) {
                                newLevels[move.level] = 1;
                            } else {
                                newLevels[move.level] = -1;
                            } 
                            return newLevels;
                        })
                    } else if(move.action === 'cln_lvl') {
                        console.log("Cleaning level: ", move.level);
                        deleteGuessLevel(move.level);
                        setLevelVerified((prev) => {
                            let newLevels = [...prev];
                            newLevels[move.level] = 0;
                            return newLevels;
                        })
                    }
                })
            }
        }
        fetch_data();
    }, [])

    let currLevel = sequence.levels[level];
    useEffect(() => {
        currLevel = sequence.levels[level];
    }, [level])

    return (
        <div id={styles.game} className="flex flex-col items-center">
            <div>
                <h1>Rimbalzi</h1>
                <h2>Livello {currLevel.level}</h2>
            </div>
            { /* ShowPreview deve essere true solo se si vuole mostrare il vero posizionamento degli ostacoli */ }
            <Board level={currLevel} showPreview={false} session_code={sessionCode} />
            <div className="flex flex-row gap-4">
                <ResetLevelButton currentLevel={Number(currLevel.level)} sessionCode={sessionCode} isMeasure={isMeasure} levelVerified={levelVerified}></ResetLevelButton>
                <VerifyLevelButton lvlNumber={Number(currLevel.level)} sessionCode={sessionCode} isMeasure={isMeasure} levelVerified={levelVerified} setLevelVerified={setLevelVerified}/>
            </div>
            <GameLevels setLevel={setLevel} level={level} levelVerified={levelVerified} sessionCode={sessionCode}/>
        </div>
    )
}