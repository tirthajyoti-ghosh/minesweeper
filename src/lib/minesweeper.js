import { TILE_STATUSES, GAME_STATUSES } from '../constants'
import {
    createGrid,
    plantMines,
    getAdjacentCounts,
    checkWin,
    checkLose,
    nearbyTiles,
} from './helpers'

export function createBoard(boardSize, numberOfMines) {
    const board = createGrid(boardSize)
    const boardWithMines = plantMines(board, boardSize, numberOfMines)
    const boardWithNumbersAndMines = getAdjacentCounts(boardWithMines)

    return boardWithNumbersAndMines
}

export function markTile(board, x, y) {
    const tile = board[x][y]
    if (
        tile.status !== TILE_STATUSES.HIDDEN &&
        tile.status !== TILE_STATUSES.MARKED
    ) {
        return board
    }

    if (tile.status === TILE_STATUSES.MARKED) {
        board[x][y].status = TILE_STATUSES.HIDDEN
    } else {
        board[x][y].status = TILE_STATUSES.MARKED
    }

    return board
}

export function revealTile(board, x, y) {
    const tile = board[x][y]

    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return board
    }

    if (tile.mine) {
        board[x][y].status = TILE_STATUSES.MINE
        return board
    }

    board[x][y].status = TILE_STATUSES.NUMBER

    const adjacentTiles = nearbyTiles(board, x, y)

    const mines = adjacentTiles.filter(t => t.mine)
    if (mines.length === 0) {
        adjacentTiles.forEach(t => revealTile(board, t.x, t.y))
    }

    return board
}

export function revealTilesWithMines(board) {
    return board.map(row => {
        return row.map(tile => {
            if (tile.mine) {
                tile.status = TILE_STATUSES.MINE
            }
            return tile
        })
    })
}

export function getGameResult(board) {
    const hasWon = checkWin(board)
    const hasLost = checkLose(board)

    if (hasWon) {
        return GAME_STATUSES.WON
    } else if (hasLost) {
        return GAME_STATUSES.LOST
    } else {
        return GAME_STATUSES.IN_PROGRESS
    }
}

export function getMinesLeftCount(tile, currentMinesCount) {
    if (tile.status === TILE_STATUSES.MINE
        || tile.status === TILE_STATUSES.NUMBER) {
        return currentMinesCount
    }

    if (tile.status === TILE_STATUSES.MARKED) {
        return currentMinesCount - 1
    }

    return currentMinesCount + 1
}
