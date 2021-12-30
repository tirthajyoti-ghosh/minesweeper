import React from 'react'
import styled from 'styled-components'

export const Desk = styled.div`
    width: ${(props) => `${props.boardSize * 40 + 40}px`};
    height: ${(props) => `${props.boardSize * 40 + 80}px`};
    display: flex;
    flex-wrap: wrap;
    margin: 5vh auto;
    padding: 20px;
    border-radius: 5px;
    background: #48E5C2;
`
