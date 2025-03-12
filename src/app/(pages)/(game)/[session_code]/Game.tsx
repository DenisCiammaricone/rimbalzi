import { Board, GameLevels } from "@/app/(pages)/(game)/[session_code]/core";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

export function Game({ sequence, isMeasure }: { sequence: Sequence, isMeasure: boolean }) {
    const [level, setLevel] = useState(0);

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

    let currLevel = sequence.levels[level];
    useEffect(() => {
        currLevel = sequence.levels[level];
    }, [level])

    return (
        <div>
            <h1>Game</h1>
            { /* ShowPreview deve essere true solo se si vuole mostrare il vero posizionamento degli ostacoli */ }
            <Board level={currLevel} showPreview={false} />
            <GameLevels setLevel={setLevel} />
        </div>
    )
}