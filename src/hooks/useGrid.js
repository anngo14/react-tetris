import { useEffect, useState } from 'react';
import { createGrid } from '../gameHelpers';

export const useGrid = (player, resetPlayer, setScore) => {
    const [grid, setGrid] = useState(createGrid());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        const isFull = row => {
            for(let i = 0; i < row.length; i++){
                if(row[i][1] === 'clear'){
                    return false;
                }
            }
            return true;
        }
        const sweepRows = newGrid => {
            newGrid.forEach((row, index) => {
                if(row[0][1] === row[row.length - 1][1] && row[0][1] === 'merge'){
                    if(isFull(row)){
                        //Iterates to all of the rows above and pushes them downwards
                        let rowIndex = index;
                        while(rowIndex > 0){
                            newGrid[rowIndex] = newGrid[rowIndex - 1];
                            rowIndex--;
                        }
                        //Adds 1 to the number of rows cleared
                        setRowsCleared(prev => prev + 1);
                        setScore(prev => prev + 17);
                    }
                }
            });
        }
        //updateGrid is defined here to be used in setGrid
        const updateGrid = prevGrid => {
            // 1. Flush the Grid
            //Maps each row from the previous grid
            const newGrid = prevGrid.map(row => 
                //maps each cell from the row and checks if it is set to 'clear'
                //if true set cell to initial default value [0, 'clear'] which results in a blank cell
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))    
            );
    
            // 2. Draw the Tetromino piece
            //player.tetromino is the assigned tetromino's shape array
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if(value !== 0){
                        newGrid[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merge' : 'clear'}`
                        ];
                    }
                });
            });

            // 3. Check if Player is collided then draw a new piece
            if(player.collided){
                resetPlayer();
                sweepRows(newGrid);
            }
    
            return newGrid;
        }
        setGrid(prevGrid => updateGrid(prevGrid));
    }, [
        //Dependency Array for useEffect()
        player,
        resetPlayer,
        setScore
    ]);

    
    return [grid, setGrid, rowsCleared, setRowsCleared];
}