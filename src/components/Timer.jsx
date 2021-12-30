import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
    flex: 1;
    text-align: right;
`

const Timer = ({ enableTimer, resetTimer }) => {
    const [time, setTime] = useState(0)

    useEffect(() => {
        if (resetTimer) {
            setTime(0)
        }
    }, [resetTimer])

    useEffect(() => {
        let gameTimer

        if (enableTimer) {
            gameTimer = setInterval(() => {
                setTime((time) => time + 1)
            }, 1000)
        }

        return () => {
            clearInterval(gameTimer)
        }
    }, [enableTimer])

    return <Container>🕙 {time.toString().padStart(3, '0')}</Container>
}

export default Timer
