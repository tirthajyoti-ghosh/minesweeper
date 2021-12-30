import React, { memo } from 'react'
import styled from 'styled-components'

import { Mine } from './Mine'
import { Flag } from './Flag'

const Cell = styled.div`
    width: 40px;
    height: 40px;
    padding: 10px;
    cursor: pointer;
    background: ${(props) => props.bgColor};
    border: 1px solid #48e5c2;
    border-radius: 4px;
    color: #333333;
    line-height: 1;
    text-align: center;
    font-size: 18px;
`

const Square = ({
    hidden,
    flagged,
    mine,
    value,
    handleClick,
    handleRightClick,
}) => {
    let bgColor = '#FCFAF9'
    let cellValue = value || ''

    if (hidden) {
        bgColor = '#333333'
        cellValue = ''
    } else if (flagged) {
        bgColor = '#ffdf00'
        cellValue = <Flag />
    } else if (mine) {
        bgColor = '#fc543c'
        cellValue = <Mine />
    }

    return (
        <Cell
            bgColor={bgColor}
            onClick={handleClick}
            onContextMenu={handleRightClick}
        >
            {cellValue}
        </Cell>
    )
}

export default memo(Square)
