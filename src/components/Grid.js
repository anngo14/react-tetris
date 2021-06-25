import React from 'react'
import Cell from './Cell'
import './styles/grid.css'

export default function Grid({ grid }) {

    return (
        <div className="grid">
            {grid.map(row => 
                row.map((col, x) => 
                    <Cell key={x} type={col[0]}/>))}
        </div>
    )
}
