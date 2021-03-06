import React from 'react';
import { TETROMINOS } from '../models/tetrominoes';
import { StyledCell } from './styles/StyledCell';

export default function Cell({ type }) {
    return (
        <StyledCell type={type} color={TETROMINOS[type].color}>
        </StyledCell>
    )
}
