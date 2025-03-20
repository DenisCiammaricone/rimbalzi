import styles from './styles.module.css'
import { Dispatch, SetStateAction, useEffect } from 'react'
import  Cookies  from 'js-cookie'

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

export function VerifyLevelButton({setLevelStatus, lvlNumber, sessionCode}:{setLevelStatus: Dispatch<SetStateAction<any[]>>, lvlNumber: number, sessionCode: string}) {
    async function check() {
        if(await verifyLevelMask(lvlNumber, sessionCode)) {
            setLevelStatus((prev) => {
                let newStatus = [...prev]
                newStatus[lvlNumber-1] = true
                return newStatus
            })
        }
    }

    return (
        <button onClick={check}>Verify</button>
    )

}

function updateSequenceGuess(lvlNum: number, row: number, col: number, obstacle: string): Sequence {
    // guess.levels[lvlNum].obstacles[row + "_" + col] = obstacle
    if(Cookies.get('guess')) {
        let guess: Sequence = JSON.parse(Cookies.get('guess') || '')
        guess.levels[lvlNum].obstacles[row + "_" + col] = obstacle
        Cookies.set('guess', JSON.stringify(guess))
        return guess
    } else {
        console.log("Errore: problema con il guess nei cookies")
        return {} as Sequence
    }
}

export function resetLevel(level: number, session_code: string) {
    if(Cookies.get('guess')) {
        let guess: Sequence = JSON.parse(Cookies.get('guess') || '')
        for( let i = 1; i <= 5; i++) {
            for( let j = 1; j <= 5; j++) {
                const cell = document.getElementById(i + "_" + j + "_cell");
                if (cell) {
                    cell.innerHTML = '';
                }
            }
        }
        guess.levels[level-1].obstacles = {}
        const res = fetch('api/game/logResetLevel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_code: session_code,
                lvlNum: level,
            })
        })
        Cookies.set('guess', JSON.stringify(guess))
    } else {
        console.log("Errore: problema con il guess nei cookies")
        throw new Error("Errore: problema con il guess nei cookies")
    }

}

async function verifyLevelMask(level: number, sessionCode: string): Promise<boolean> {
    const lvl = level - 1
    if(Cookies.get('guess')) {
        const res = await fetch('api/game/verifyLevelMask?lvl=' + lvl + '&session=' + sessionCode, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()
        if(res.status === 200 && data.message === 'Ok') {
            return true
        }
    } else {
        throw new Error("Errore: problema con il guess nei cookies")
    }
    return false;
}

// TODO: Per migliorare la responsiveness fare una rotta API verifySequence anzichè chiaare verifyLevel 10 volte
async function verifySequence(sessionCode: string) {
    let verified = Array(10).fill(false)
    
    if(Cookies.get('guess')) {
        const res = await fetch('api/game/verifySequenceMask?&session=' + sessionCode, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()
        if(res.status === 200 && data.message === 'Ok') {
            verified = data.verifiedLevels
            return verified
        } else {
            throw new Error("Errore: problema con il guess nei cookies")
        }
    }
    return verified
}

async function cellClick(currentTarget: EventTarget & HTMLDivElement, row: number, col: number, lvlNumber: number, session_code: string) {
    let oldObstacle = ''
    let newObstacle = ''
    switch (currentTarget.innerHTML) {
        case '/':
            currentTarget.innerHTML = '\\'
            oldObstacle = '/'
            newObstacle = '\\'
            break;
        case '\\': 
            currentTarget.innerHTML = ''
            oldObstacle = '\\'
            newObstacle = ''
            break;
        case '':
            currentTarget.innerHTML = '/'
            oldObstacle = ''
            newObstacle = '/'
            break;
    }

    const res = await fetch('api/game/logObstacleChange', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session_code: session_code,
            level: lvlNumber,
            x: row,
            y: col,
            starting_obstacle: oldObstacle,
            new_obstacle: newObstacle
        })
    })
    let a = updateSequenceGuess(lvlNumber-1, row, col, currentTarget.innerHTML)
    //console.log(a.levels[lvlNumber-1].level + ": ", a.levels[lvlNumber-1].obstacles)
}

// Passo arrowClickObj per poter avere la variabile come reference
function arrowClick(currentTarget: EventTarget & HTMLDivElement, level: Level, arrowClickObj: {value: number}) {
    if(parseInt(currentTarget.innerHTML)) {
        return
    } else {
        arrowClickObj.value++
    }
    const [ballPosition, direction] = checkOutputArrow(currentTarget.id, level)
    let outputTarget: HTMLElement | null = null
    if (direction === 'ltr' || direction === 'rtl') {
        outputTarget = document.getElementById(negateDirection(direction) + "_" + ballPosition[0])
    } else if (direction === 'utd' || direction === 'dtu') {
        outputTarget = document.getElementById(negateDirection(direction) + "_" + ballPosition[1])
    }
    //console.log("Output arrow: ")
    if (outputTarget) {
        currentTarget.innerHTML = arrowClickObj.value.toString()
        outputTarget.innerHTML = arrowClickObj.value.toString()
    }
}

async function changeLevelClick(currentLevel: Number, sessionCode: string, currentTarget: EventTarget & HTMLButtonElement, setLevel: Dispatch<SetStateAction<number>>) {
    const res = await fetch('api/game/logChangeLevel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_code: sessionCode,
                from: currentLevel.valueOf() + 1, 
                to: parseInt(currentTarget.value) + 1
            })

    })
    setLevel(parseInt(currentTarget.value))
}

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
        //console.log(obstacle + " at: " + ballPosition[0] + "," + ballPosition[1]);
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

export function Board({ level, showPreview, session_code }: { level: Level, showPreview: boolean, session_code: string }) {
    const size: number = Number(level.size) // WARNING: This is a number, not a string
    let arrowClickObj = {value: 0}; // Uso un oggetto così da passare la variabile per reference

    let ltr = 0 // Left to right arrow counter
    let rtl = 0 // Right to left arrow counter
    let utd = 0 // Up to down arrow counter
    let dtu = 0 // Down to up arrow counter
    let column = 0 // Column index
    let row = 1 // Row index
    return (
        <div>
            <h2>Livello {level.level}</h2>
            <div className={styles.gameBoard} style={{ gridTemplateColumns: 'repeat(' + (size + 2) + ', 1fr)', gridTemplateRows: 'repeat(' + (size + 2) + ', 1fr)' }}>
                {Array.from({ length: ((size + 2) * (size + 2)) }).map((_, index) => {
                    if (index === 0 || index === (size + 1) || index === (size + 2) * (size + 1) || index === (size + 2) * (size + 2) - 1) {
                        return <div key={index} className={styles.empty}></div>
                    } else {
                        if (index % (size + 2) === 0) {
                            ltr++
                            const ltrElement = document.getElementById("ltr_" + ltr);
                            if (ltrElement) {
                                ltrElement.innerHTML = '&rarr;'
                            }
                            return <div key={index} id={"ltr_" + ltr} className={`${styles.arrow} ${styles.r_arrow}`} onClick={(e) => arrowClick(e.currentTarget, level, arrowClickObj)}>&rarr;</div>
                        } else if (index % (size + 2) === size + 1) {
                            rtl++
                            const rtlElement = document.getElementById("rtl_" + rtl);
                            if (rtlElement) {
                                rtlElement.innerHTML = '&larr;';
                            }
                            return <div key={index} id={"rtl_" + rtl} className={`${styles.arrow} ${styles.l_arrow}`} onClick={(e) => arrowClick(e.currentTarget, level, arrowClickObj)}>&larr;</div>
                        } else if (index < size + 2) {
                            utd++
                            const utdElement = document.getElementById("utd_" + utd);
                            if (utdElement) {
                                utdElement.innerHTML = '&darr;';
                            }
                            return <div key={index} id={"utd_" + utd} className={`${styles.arrow} ${styles.d_arrow}`} onClick={(e) => arrowClick(e.currentTarget, level, arrowClickObj)}>&darr;</div>
                        } else if (index >= (size + 1) * (size + 2)) {
                            dtu++
                            const dtuElement = document.getElementById("dtu_" + dtu);
                            if (dtuElement) {
                                dtuElement.innerHTML = '&uarr;';
                            }
                            return <div key={index} id={"dtu_" + dtu} className={`${styles.arrow} ${styles.u_arrow}`} onClick={(e) => arrowClick(e.currentTarget, level, arrowClickObj)}>&uarr;</div>
                        }
                        else {
                            if (column < size) {
                                column++
                            } else {
                                column = 1
                                row++
                            }

                            // const obstacle = level.obstacles[row + "_" + column]
                            let obstacle: string
                            if(showPreview) {
                                obstacle = level.obstacles[row + "_" + column]
                            } else {
                                obstacle = JSON.parse(Cookies.get('guess') || '').levels[level.level - 1].obstacles[row + "_" + column]
                            }
                            return (
                                <BoardCell key={index} row={row} col={column} lvlNumber={level.level} obstacle={obstacle} preview={showPreview} session_code={session_code}></BoardCell>
                            )
                        }
                    }
                })}
            </div>
        </div >
    )
}

/**
 * 
 * @param row the row of the cell
 * @param col the column of the cell
 * @param obstacle the obstacle in the cell
 * @param preview true if the cell should draw the obstacle false otherwise
 * @returns drawing of a cell
 */
function BoardCell({ row, col, lvlNumber, obstacle, preview, session_code }: { row: number, col: number, lvlNumber: number, obstacle?: string, preview?: boolean, session_code: string }) {
    const cell = document.getElementById(row + "_" + col + "_cell")
    if(preview && obstacle){
        if (cell) {
            cell.innerHTML = obstacle 
        }
    } else if(cell) {
        //console.log("Obstacle " + row + "_" + col, obstacle)
        if(obstacle) {
            cell.innerHTML = obstacle
        } else {
            cell.innerHTML = ''
        }
    }
    return (
        <div
            id={row + "_" + col + "_cell"}
            className={styles.cell}
            onClick={(e) => cellClick(e.currentTarget, row, col, lvlNumber, session_code)}
        >
        {obstacle}
        </div>
    )
}

export function GameLevels({ setLevel, level, setLevelStatus, levelStatus, sessionCode }: { setLevel: Dispatch<SetStateAction<number>>, level: Number, setLevelStatus: Dispatch<SetStateAction<any[]>>, levelStatus: any[], sessionCode: string }) {
    const _lvlNumber = 10

    useEffect(() => {
        const verifySeq = async () => {
            const verifiedSeq = await verifySequence(sessionCode)
            setLevelStatus(verifiedSeq)
        }
        verifySeq();
    },[])

    const gameLevels = Array.from({ length: _lvlNumber }, (_, index) => {
        if(levelStatus[index]) {
            return (
                <button key={index} id={index + "_levelButton"} value={index} onClick={(e) => changeLevelClick(level, sessionCode, e.currentTarget, setLevel)} className='text-green-500'>{index + 1}</button>
            )        
        } else {
            return (
                <button key={index} id={index + "_levelButton"} value={index} onClick={(e) => changeLevelClick(level, sessionCode, e.currentTarget, setLevel)} className='text-red-500'>{index + 1}</button>
            )
        }
    })



    return (
        <div id="gameLevels">
            <h1>LevelChooser:</h1>
            <div id="gameLevels" className='flex flex-row gap-4'>
                {gameLevels}
            </div>
        </div>
    )
}