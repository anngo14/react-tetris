export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

//Sleep Function to delay
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//Initializes the Grid
export const createGrid = () => {
    return Array.from(Array(STAGE_HEIGHT), () => Array(STAGE_WIDTH).fill([0, 'clear']));
}

//Checks if there are any collisions
export const checkCollision = (player, grid, { x: moveX, y: moveY }) => {
    for(let row = 0; row < player.tetromino.length; row++){
        for(let col = 0; col < player.tetromino[0].length; col++){
            if(player.tetromino[row][col] !== 0){
                let nextMoveY = row + player.pos.y + moveY;
                let nextMoveX = col + player.pos.x + moveX;
                //Checks if nextMove is valid (merge) and within bounds of the grid
                if(nextMoveY >= grid.length || nextMoveX < 0 || nextMoveX >= grid[0].length || grid[nextMoveY][nextMoveX][1] === 'merge'){
                    return true;
                }
            }
        }
    }
    return false;
}