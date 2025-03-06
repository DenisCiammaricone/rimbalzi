import styles from './styles.module.css'
import { Dispatch, SetStateAction } from 'react'


function cellClick(currentTarget: EventTarget & HTMLDivElement) {
    currentTarget.innerHTML = 'X'
}

function arrowClick(currentTarget: EventTarget & HTMLDivElement) {
    console.log("Arrow clicked")
}

function changeLevelClick(currentTarget: EventTarget & HTMLButtonElement, setLevel: Dispatch<SetStateAction<number>>) {
    setLevel(parseInt(currentTarget.value))
    console.log("Switching to: level_" + currentTarget.value)
}

export function Board({ level }: { level: Level }) {
    const size: number = Number(level.size) // WARNING: This is a number, not a string
    return (
        <div>
            <h2>Livello {level.level}</h2>
            <div className={styles.gameBoard} style={{ gridTemplateColumns: 'repeat(' + (size + 2) + ', 1fr)', gridTemplateRows: 'repeat(' + (size + 2) + ', 1fr)' }}>
                {Array.from({ length: ((size + 2) * (size + 2)) }).map((_, index) => {
                    if (index === 0 || index === (size + 1) || index === (size + 2) * (size + 1) || index === (size + 2) * (size + 2) - 1) {
                        return <div key={index} className={styles.empty}></div>
                    } else {
                        if (index % (size + 2) === 0) {
                            return <div key={index} className={`${styles.arrow} ${styles.r_arrow}`} onClick={(e) => arrowClick(e.currentTarget)}>&rarr;</div>
                        } else if (index % (size + 2) === size + 1) {
                            return <div key={index} className={`${styles.arrow} ${styles.l_arrow}`} onClick={(e) => arrowClick(e.currentTarget)}>&larr;</div>
                        } else if (index < size + 2) {
                            return <div key={index} className={`${styles.arrow} ${styles.d_arrow}`} onClick={(e) => arrowClick(e.currentTarget)}>&darr;</div>
                        } else if (index >= (size + 1) * (size + 2)) {
                            return <div key={index} className={`${styles.arrow} ${styles.u_arrow}`} onClick={(e) => arrowClick(e.currentTarget)}>&uarr;</div>
                        }
                        else {
                            return (
                                <div
                                    key={index}
                                    className={styles.cell}
                                    onClick={(e) => cellClick(e.currentTarget)}
                                >
                                    {index}
                                </div>
                            )
                        }
                    }
                })}
            </div>
        </div >
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