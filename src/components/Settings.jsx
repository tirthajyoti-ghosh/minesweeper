import React, { useState, useEffect, memo } from 'react'
import styled from 'styled-components'

const RangeSlider = styled.div`
    margin: 30px auto;
    width: 440px;
`

const Label = styled.p`
    margin-bottom: 5px;
`

const RangeSliderRange = styled.input`
    -webkit-appearance: none;
    width: calc(100% - (73px));
    height: 10px;
    border-radius: 5px;
    background: #d7dcdf;
    outline: none;
    padding: 0;
    margin: 0;

    ::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #2c3e50;
        cursor: pointer;
        -webkit-transition: background 0.15s ease-in-out;
        transition: background 0.15s ease-in-out;
    }
    &::-webkit-slider-thumb:hover {
        background: #48e5c2;
    }
    &:active::-webkit-slider-thumb {
        background: #48e5c2;
    }
    &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border: 0;
        border-radius: 50%;
        background: #2c3e50;
        cursor: pointer;
        -moz-transition: background 0.15s ease-in-out;
        transition: background 0.15s ease-in-out;
    }
    &::-moz-range-thumb:hover {
        background: #48e5c2;
    }
    &:active::-moz-range-thumb {
        background: #48e5c2;
    }
    &:focus::-webkit-slider-thumb {
        box-shadow: 0 0 0 3px #fff, 0 0 0 6px #48e5c2;
    }
`

const RangeSliderValue = styled.span`
    display: inline-block;
    position: relative;
    width: 60px;
    color: #fff;
    line-height: 20px;
    text-align: center;
    border-radius: 3px;
    background: #2c3e50;
    padding: 5px 10px;
    margin-left: 8px;

    &:after {
        position: absolute;
        top: 8px;
        left: -7px;
        width: 0;
        height: 0;
        border-top: 7px solid transparent;
        border-right: 7px solid #2c3e50;
        border-bottom: 7px solid transparent;
        content: '';
    }
`

const Button = styled.button`
    display: block;
    width: 80px;
    margin: 0 auto;
    border-radius: 5px;
    cursor: pointer;
    padding: 10px;
    border: none;
    background: #2c3e50;
    color: #fff;
`

const Settings = ({ updateBoard }) => {
    const [boardSize, setBoardSize] = useState(10)
    const [mines, setMines] = useState(10)

    useEffect(() => {
		const maxMineCount = (boardSize - 1) * (boardSize - 1);

		if (mines > maxMineCount) {
			setMines(maxMineCount)
		}
	}, [boardSize, mines]);

    return (
        <div>
            <RangeSlider>
                <Label>Board size</Label>
                <RangeSliderRange
                    type="range"
                    name="boardSize"
                    min="10"
                    max="20"
                    value={boardSize}
                    onChange={(e) => setBoardSize(e.target.value)}
                />
                <RangeSliderValue>{boardSize}</RangeSliderValue>
            </RangeSlider>

            <RangeSlider>
                <Label>Number of mines</Label>
                <RangeSliderRange
                    type="range"
                    name="mines"
                    min="10"
                    max={(boardSize - 1) * (boardSize - 1)}
                    value={mines}
                    onChange={(e) => setMines(e.target.value)}
                />
                <RangeSliderValue>{mines}</RangeSliderValue>
            </RangeSlider>

            <Button onClick={() => updateBoard(boardSize, mines)}>
                Set
            </Button>
        </div>
    )
}

export default memo(Settings)
