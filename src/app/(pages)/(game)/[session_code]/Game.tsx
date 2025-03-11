import { Board, GameLevels } from "@/app/(pages)/(game)/[session_code]/core";
import { useEffect, useState } from "react";

export function Game({ sequence, isMeasure }: { sequence: Sequence, isMeasure: boolean }) {
    const [level, setLevel] = useState(0);

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