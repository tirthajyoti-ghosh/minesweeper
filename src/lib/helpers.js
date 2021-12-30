import { TILE_STATUSES } from '../constants'

export function createGrid(boardSize) {
    const grid = []

    for (let x = 0; x < boardSize; x++) {
        const row = []
        for (let y = 0; y < boardSize; y++) {
            const tile = {
                value: 0,
                x,
                y,
                mine: false,
                status: TILE_STATUSES.HIDDEN,
            }

            row.push(tile)
        }
        grid.push(row)
    }

    return grid
}

export function plantMines(board, boardSize, numberOfMines) {
    while (numberOfMines) {
        const y = randomNumber(boardSize);
        const x = randomNumber(boardSize);

        if (!board[y][x].mine) {
            board[y][x].mine = true;
            numberOfMines--;
        }
    }
    return board;
}

export function getAdjacentCounts(board) {
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            if (board[x][y].mine) {
                board = putMineCountInMineAdjacentTiles(board, x, y);
            }
        }
    }

    return board;
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return (
                tile.status === TILE_STATUSES.NUMBER ||
                (tile.mine &&
                    (tile.status === TILE_STATUSES.HIDDEN ||
                        tile.status === TILE_STATUSES.MARKED))
            )
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}

export function nearbyTiles(board, x, y) {
    const tiles = []

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset]
            if (tile) tiles.push(tile)
        }
    }

    return tiles
}

function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

function putMineCountInMineAdjacentTiles(board, x, y) {
    let xList = [x - 1, x, x + 1];
    let yList = [y - 1, y, y + 1];

    for (let a of xList) {
        if (board[a]) {
            for (let b of yList) {
                if (board[a][b] !== undefined && !board[a][b].mine) {
                    board[a][b].value += 1
                }
            }
        }
    }

    return board;
}
