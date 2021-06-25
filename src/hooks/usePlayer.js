import { useState, useCallback } from 'react';
import { checkCollision, STAGE_WIDTH } from '../gameHelpers';
import { getRandomTetromino, TETROMINOS } from '../models/tetrominoes';

export const usePlayer = () => {
    const[player, setPlayer] = useState({
        //Default Player implementation
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS[0].shape,
        collided: false
    });

    const resetPlayer = useCallback(() => {
        let offset = 1;
        setPlayer({
            //Initializes the new Player to the middle of the grid at the top
            //The offset is to center the tetromino better
            //pos: { x: (STAGE_WIDTH / 2) - offset, y: 0 },
            pos: { x: (STAGE_WIDTH / 2) - offset, y: 0 },
            tetromino: getRandomTetromino().shape,
            collided: false
        });
    }, []);

    const updatePlayerPos = ({ x, y, collided }) => {
        setPlayer(prevPlayer => ({
            //spread operator
            //takes the prevPlayer object and fills out the rest of the attributes
            //...prevPlayer
            //In this case I didn't use it because we are already setting pos and collided attributes
            pos: { x: prevPlayer.pos.x + x, y: prevPlayer.pos.y + y },
            tetromino: prevPlayer.tetromino,
            collided: collided
        }));
    };

    //Rotates an Array 90 degrees to the right
    const rotateArray = (array, dir) => {
        //Transpose the array rows become cols
        const mtrx = array.map((_, index) => array.map(column => column[index]));
        //Reverse each row to get a rotated array
        if(dir > 0) return mtrx.map(row => row.reverse());
        return mtrx.reverse();
    }

    const rotatePlayer = (grid) => {
        //Deep copy of player object
        const clone = JSON.parse(JSON.stringify(player));
        clone.tetromino = rotateArray(clone.tetromino, 1);

        //Checks if the rotated piece collides with its surroundings
        const pos = clone.pos.x;
        //clone.tetromino[0].length === 4 is for the I shape
        //offset is -1 for I shape because the shape needs to be offset 1 more space to the left than other shapes
        //this is because when the first rotation occurs the I shape is the only shape that will overflow by 2 cells
        //the rest of the shapes will only overflow a max of 1 cell
        let offset = clone.tetromino[0].length === 4 ? -1 : 1;
        //checks the wiggle room left and right of the player for possible collisions
        while (checkCollision(clone, grid, { x: 0, y: 0 })) {
            clone.pos.x += offset;
            //reverses the offset in the opposite direction by (offset + 1) cell over
            offset = -(offset + (offset > 0 ? 1 : -1));
            //if offset is larger than the width of the shape rotates the shape back by 90 degrees and places the player at its original x position
            if (offset > clone.tetromino[0].length) {
                rotateArray(clone.tetromino, -1);
                clone.pos.x = pos;
                return;
            }
        }

        //Set rotated piece 
        setPlayer(clone);
    }

    return [player, resetPlayer, updatePlayerPos, rotatePlayer];
}