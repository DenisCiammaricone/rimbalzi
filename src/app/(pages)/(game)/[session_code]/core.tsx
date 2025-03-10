import styles from './styles.module.css'
import { Dispatch, SetStateAction } from 'react'


export function negateDirection(direction: 'ltr' | 'rtl' | 'utd' | 'dtu'): string {
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

function cellClick(currentTarget: EventTarget & HTMLDivElement, row: number, col: number) {
    console.log("Cell clicked on: " + row + "," + col)
    currentTarget.innerHTML = 'X'
}

function arrowClick(currentTarget: EventTarget & HTMLDivElement, level: Level) {
    console.log("Arrow clicked on: " + currentTarget.id)
    const [ballPosition, direction] = checkOutputArrow(currentTarget.id, level)
    let outputTarget: HTMLElement | null = null
    if (direction === 'ltr' || direction === 'rtl') {
        outputTarget = document.getElementById(negateDirection(direction) + "_" + ballPosition[0])
    } else if (direction === 'utd' || direction === 'dtu') {
        outputTarget = document.getElementById(negateDirection(direction) + "_" + ballPosition[1])
    }
    console.log("Output arrow: ")
    if (outputTarget) {
        outputTarget.innerHTML = 'X'
    }
}

function changeLevelClick(currentTarget: EventTarget & HTMLButtonElement, setLevel: Dispatch<SetStateAction<number>>) {
    setLevel(parseInt(currentTarget.value))
    console.log("Switching to: level_" + (parseInt(currentTarget.value) + 1))
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

export function Board({ level }: { level: Level }) {
    const size: number = Number(level.size) // WARNING: This is a number, not a string

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
                            return <div key={index} id={"ltr_" + ltr} className={`${styles.arrow} ${styles.r_arrow}`} onClick={(e) => arrowClick(e.currentTarget, level)}>&rarr;</div>
                        } else if (index % (size + 2) === size + 1) {
                            rtl++
                            const rtlElement = document.getElementById("rtl_" + rtl);
                            if (rtlElement) {
                                rtlElement.innerHTML = '&larr;';
                            }
                            return <div key={index} id={"rtl_" + rtl} className={`${styles.arrow} ${styles.l_arrow}`} onClick={(e) => arrowClick(e.currentTarget, level)}>&larr;</div>
                        } else if (index < size + 2) {
                            utd++
                            const utdElement = document.getElementById("utd_" + utd);
                            if (utdElement) {
                                utdElement.innerHTML = '&darr;';
                            }
                            return <div key={index} id={"utd_" + utd} className={`${styles.arrow} ${styles.d_arrow}`} onClick={(e) => arrowClick(e.currentTarget, level)}>&darr;</div>
                        } else if (index >= (size + 1) * (size + 2)) {
                            dtu++
                            const dtuElement = document.getElementById("dtu_" + dtu);
                            if (dtuElement) {
                                dtuElement.innerHTML = '&uarr;';
                            }
                            return <div key={index} id={"dtu_" + dtu} className={`${styles.arrow} ${styles.u_arrow}`} onClick={(e) => arrowClick(e.currentTarget, level)}>&uarr;</div>
                        }
                        else {
                            if (column < size) {
                                column++
                            } else {
                                column = 1
                                row++
                            }

                            const obstacle = level.obstacles[row + "_" + column]
                            return (
                                <BoardCell key={index} row={row} col={column} obstacle={obstacle} preview={true}></BoardCell>
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
function BoardCell({ row, col, obstacle, preview }: { row: number, col: number, obstacle?: string, preview?: boolean }) {
    return (
        <div
            className={styles.cell}
            onClick={(e) => cellClick(e.currentTarget, row, col)}
        >
            {preview && obstacle}
        </div>
    )
}

export function GameLevels({ setLevel }: { setLevel: Dispatch<SetStateAction<number>> }) {
    const _lvlNumber = 10
    const gameLevels = Array.from({ length: _lvlNumber }, (_, index) => (
        <button key={index} id={index + "_levelButton"} value={index} onClick={(e) => changeLevelClick(e.currentTarget, setLevel)}>{index + 1}</button>
    ))

    return (
        <div id="gameLevels">
            <h1>LevelChooser:</h1>
            <div id="gameLevels" className='flex flex-row gap-4'>
                {gameLevels}
            </div>
        </div>
    )
}