import {
    createBoard,
    markTile,
    revealTile,
    revealTilesWithMines,
    getGameResult,
    getMinesLeftCount
} from "../src/lib/minesweeper"
import { nearbyTiles } from "../src/lib/helpers"
import { TILE_STATUSES, GAME_STATUSES } from '../src/constants'

describe("createBoard", () => {
    let board
    beforeEach(() => {
        board = createBoard(5, 7)
    })

    it("should return an array of arrays", () => {
        expect(Array.isArray(board)).toBe(true)
        expect(Array.isArray(board[0])).toBe(true)
    })

    it("should return an array of arrays of the given size", () => {
        expect(board.length).toBe(5)
        expect(board[0].length).toBe(5)
    })

    it("should return array of arrays of objects having 'value', 'x', 'y', 'mine' and 'status' properties", () => {
        expect(board[0][0]).toHaveProperty('value')
        expect(board[0][0]).toHaveProperty('x')
        expect(board[0][0]).toHaveProperty('y')
        expect(board[0][0]).toHaveProperty('mine')
        expect(board[0][0]).toHaveProperty('status')
    })

    it("should create a board that has given number of mines in it", () => {
        expect(board.flat().filter(tile => tile.mine).length).toBe(7)
    })

    it("should create a board with numbered tiles surrounding a mine", () => {
        const mine = board.flat().find(tile => tile.mine)
        const adjacentTiles = nearbyTiles(board, mine.x, mine.y)
        const minesInAdjacentTiles = adjacentTiles.filter(tile => tile.mine).length
        const actualNumberedTilesInAdjacentTiles = adjacentTiles.length - minesInAdjacentTiles

        expect(adjacentTiles.filter(tile => tile.value > 0).length).toBe(actualNumberedTilesInAdjacentTiles)
    })
})

describe("markTile", () => {
    let board
    let markedBoard
    beforeEach(() => {
        board = createBoard(5, 7)
        markedBoard = markTile(board, 0, 0)
    })

    it("should return a board with a marked tile", () => {
        expect(markedBoard[0][0].status).toBe(TILE_STATUSES.MARKED)
    })

    it("should return a board with a marked tile unmarked(hidden)", () => {
        const newBoard = markTile(markedBoard, 0, 0)

        expect(newBoard[0][0].status).toBe(TILE_STATUSES.HIDDEN)
    })

    it("should return the original board if the given tile is either already revealed", () => {
        board[0][0].status = TILE_STATUSES.NUMBER
        const newBoard = markTile(board, 0, 0)

        expect(newBoard[0][0].status).toBe(TILE_STATUSES.NUMBER)
    })

    it("should return the original board if the given tile is a mine", () => {
        board[0][0].status = TILE_STATUSES.MINE
        const newBoard = markTile(board, 0, 0)

        expect(newBoard[0][0].status).toBe(TILE_STATUSES.MINE)
    })
})

describe("revealTile", () => {
    let board
    let tile
    beforeEach(() => {
        board = createBoard(5, 7)
        tile = board[0][0]
    })

    it("should return a board with a revealed tile", () => {
        tile.mine = false // making sure the tile at x=0, y=0 is not a mine
        const revealedBoard = revealTile(board, tile.x, tile.y)

        expect(revealedBoard[0][0].status).toBe(TILE_STATUSES.NUMBER)
    })

    it("should return a board with a revealed tile marked as a mine", () => {
        tile.mine = true
        const revealedBoard = revealTile(board, tile.x, tile.y)

        expect(revealedBoard[0][0].status).toBe(TILE_STATUSES.MINE)
    })

    it("should return the original board if the given tile is already revealed", () => {
        tile.status = TILE_STATUSES.NUMBER
        const newBoard = revealTile(board, tile.x, tile.y)

        expect(newBoard[0][0].status).toBe(TILE_STATUSES.NUMBER)
    })

    it("should return the original board if the given tile is a mine", () => {
        tile.status = TILE_STATUSES.MINE
        const newBoard = revealTile(board, tile.x, tile.y)

        expect(newBoard[0][0].status).toBe(TILE_STATUSES.MINE)
    })

    it("should return the original board if the given tile is marked", () => {
        tile.status = TILE_STATUSES.MARKED
        const newBoard = revealTile(board, tile.x, tile.y)

        expect(newBoard[0][0].status).toBe(TILE_STATUSES.MARKED)
    })
})

describe("revealTilesWithMines", () => {
    it("should return a board with all the mines revealed", () => {
        const board = createBoard(5, 7)
        const revealedBoard = revealTilesWithMines(board)

        expect(revealedBoard.flat().filter(tile => tile.status === TILE_STATUSES.MINE).length).toBe(7)
    })
})

describe("getGameResult", () => {
    let board
    beforeEach(() => {
        board = createBoard(5, 7)
    })

    it("should return GAME_STATUSES.WON if all the tiles except mines are revealed", () => {
        const revealedBoard = board.map(row =>
            row.map(tile => {
                if (tile.mine) return tile

                tile.status = TILE_STATUSES.NUMBER
                return tile
            })
        )

        expect(getGameResult(revealedBoard)).toBe(GAME_STATUSES.WON)
    })

    it("should return GAME_STATUSES.LOST if a tile with mine is revealed", () => {
        board[0][0].mine = true // manually setting tile as mine so as to not spend time finding one
        board[0][0].status = TILE_STATUSES.MINE

        expect(getGameResult(board)).toBe(GAME_STATUSES.LOST)
    })

    it("should return GAME_STATUSES.IN_PROGRESS if game is still in progress", () => {
        board[0][0].mine = false // making sure the tile at x=0, y=0 is not a mine
        board[0][0].status = TILE_STATUSES.NUMBER

        expect(getGameResult(board)).toBe(GAME_STATUSES.IN_PROGRESS)
    })
})

describe("getMinesLeftCount", () => {
    it("should return the current mines count if the tile is a mine", () => {
        const tile = {
            status: TILE_STATUSES.MINE,
        }

        expect(getMinesLeftCount(tile, 0)).toBe(0)
    })

    it("should return the current mines count if the tile is already revealed", () => {
        const tile = {
            status: TILE_STATUSES.NUMBER,
        }

        expect(getMinesLeftCount(tile, 0)).toBe(0)
    })

    it("should return current mines count - 1 if the tile is marked", () => {
        const tile = {
            status: TILE_STATUSES.MARKED,
        }

        expect(getMinesLeftCount(tile, 1)).toBe(0)
    })

    it("should return current mines count + 1 if the tile is hidden", () => {
        const tile = {
            status: TILE_STATUSES.HIDDEN,
        }

        expect(getMinesLeftCount(tile, 0)).toBe(1)
    })
})
