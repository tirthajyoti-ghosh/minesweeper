import React, { memo } from 'react'
import styled from 'styled-components'

import Timer from './Timer'

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
`

const Count = styled.span`
    flex: 1;
    text-align: left;
`

const Status = styled.span`
    flex: 1;
    text-align: center;
    cursor: pointer;
`

const GameInfo = ({
    minesLeft,
    minesCount,
    gameStatus,
    enableTimer,
    resetTimer,
    restartGame,
}) => (
    <Container>
        <Count>
            💣 {minesLeft} / {minesCount}
        </Count>
        <Status onClick={restartGame}>{gameStatus}</Status>
        <Timer enableTimer={enableTimer} resetTimer={resetTimer} />
    </Container>
)

export default memo(GameInfo)
