import { Board, GameLevels } from "@/app/(pages)/(game)/[session_code]/core";
import { useEffect, useState } from "react";

export function Game({ sequence, isMeasure }: { sequence: Sequence, isMeasure: boolean }) {
    const [level, setLevel] = useState(0);

    let currLevel = sequence.levels[level];
    useEffect(() => {
        console.log("Switched to: level_" + level)
        currLevel = sequence.levels[level];
    }, [level])

    return (
        <div>
            <h1>Game</h1>
            <Board level={currLevel} />
            <GameLevels setLevel={setLevel} />
        </div>
    )
}