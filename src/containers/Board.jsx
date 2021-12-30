import React, { useState, useCallback } from 'react'

import { Desk } from '../components/Desk'
import Square from '../components/Square'
import GameInfo from '../components/GameInfo'
import Settings from '../components/Settings'

import {
    createBoard,
    markTile,
    revealTile,
    revealTilesWithMines,
    getGameResult,
    getMinesLeftCount,
} from '../lib/minesweeper'
import { TILE_STATUSES, GAME_STATUSES } from '../constants'

const Board = () => {
    const [boardSize, setBoardSize] = useState(10)
    const [mineCount, setMineCount] = useState(10)
    const [board, setBoard] = useState(createBoard(boardSize, mineCount))
    const [gameStatus, setGameStatus] = useState(GAME_STATUSES.IN_PROGRESS)
    const [minesLeft, setMinesLeft] = useState(mineCount)
    const [enableTimer, setEnableTimer] = useState(false)
    const [resetTimer, setResetTimer] = useState(false)

    const startTimer = useCallback(() => {
        setEnableTimer(true)
        setResetTimer(false)
    }, [gameStatus, boardSize, mineCount])

    const handleClick = useCallback(
        (tile) => {
            if (gameStatus !== GAME_STATUSES.IN_PROGRESS) return

            startTimer()

            const newBoard = revealTile([...board], tile.x, tile.y)
            const result = getGameResult(newBoard)

            if (result === GAME_STATUSES.WON) {
                setGameStatus(GAME_STATUSES.WON)
                setEnableTimer(false)
            } else if (result === GAME_STATUSES.LOST) {
                const newBoard = revealTilesWithMines([...board])

                setBoard(newBoard)
                setGameStatus(GAME_STATUSES.LOST)
                setEnableTimer(false)
            } else {
                setBoard(newBoard)
            }
        },
        [gameStatus, boardSize, mineCount, board]
    )

    const handleRightClick = useCallback(
        (e, tile) => {
            e.preventDefault()

            if (gameStatus !== GAME_STATUSES.IN_PROGRESS) return

            startTimer()

            const newBoard = markTile([...board], tile.x, tile.y)
            const minesLeftCount = getMinesLeftCount(tile, minesLeft)

            setBoard(newBoard)
            setMinesLeft(minesLeftCount)
        },
        [gameStatus, minesLeft, boardSize, mineCount, board]
    )

    const restartGame = useCallback(() => {
        if (gameStatus === GAME_STATUSES.IN_PROGRESS) return

        setBoard(createBoard(boardSize, mineCount))
        setGameStatus(GAME_STATUSES.IN_PROGRESS)
        setMinesLeft(mineCount)
        setResetTimer(true)
        setEnableTimer(false)
    }, [gameStatus, boardSize, mineCount])

    const updateBoard = useCallback((size, mines) => {
        setBoardSize(size)
        setMineCount(mines)

        setBoard(createBoard(size, mines))
        setGameStatus(GAME_STATUSES.IN_PROGRESS)
        setMinesLeft(mines)
        setResetTimer(true)
        setEnableTimer(false)
    }, [mineCount, boardSize])

    return (
        <>
            <Settings updateBoard={updateBoard} />
            <Desk boardSize={boardSize}>
                <GameInfo
                    gameStatus={gameStatus}
                    minesLeft={minesLeft}
                    minesCount={mineCount}
                    enableTimer={enableTimer}
                    resetTimer={resetTimer}
                    restartGame={restartGame}
                />

                {board.map((row) => {
                    return row.map((tile) => {
                        return (
                            <Square
                                key={`${tile.x}-${tile.y}-${tile.status}`}
                                hidden={tile.status === TILE_STATUSES.HIDDEN}
                                flagged={tile.status === TILE_STATUSES.MARKED}
                                mine={tile.status === TILE_STATUSES.MINE}
                                value={tile.value}
                                handleClick={() => handleClick(tile)}
                                handleRightClick={(e) =>
                                    handleRightClick(e, tile)
                                }
                            />
                        )
                    })
                })}
            </Desk>
        </>
    )
}

export default Board
