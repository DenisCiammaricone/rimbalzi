'use client'
import styles from '@/game/styles.module.css'
import { JSX, useRef } from 'react'


function cellClick(cellNumber: number, currentTarget: EventTarget & HTMLDivElement) {
    currentTarget.innerHTML = 'X'
}

export function game(_boardSize: number) {
    return (
        <div>
            <h1>Game</h1>
            <div className={styles.gameBoard} style={{ gridTemplateColumns: `repeat(${_boardSize}, 1fr)`, gridTemplateRows: `repeat(${_boardSize}, 1fr)` }}>
                {Array.from({ length: _boardSize * _boardSize }).map((_, index) => (
                    <div
                        key={index}
                        className={styles.cell}
                        onClick={(e) => cellClick(index + 1, e.currentTarget)}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
            <div id="gameLevels">
                <a>1</a>
                <a>2</a>
                <a>3</a>
                <a>4</a>
                <a>5</a>
            </div>
        </div>
    )
}