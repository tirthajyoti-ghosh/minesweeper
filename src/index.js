import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Board from './containers/Board'

const Title = styled.h1`
    margin: 32px;
    text-align: center;
`

const App = () => (
    <>
        <Title>Minesweeper</Title>
        <Board />
    </>
)

ReactDOM.render(<App />, document.getElementById('root'))
