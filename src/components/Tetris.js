import { React, useState } from 'react';
import { useGrid } from '../hooks/useGrid';
import { useInterval } from '../hooks/useInterval';
import { createGrid,  checkCollision, sleep, STAGE_HEIGHT } from '../gameHelpers';
import { usePlayer } from '../hooks/usePlayer';
import ActionButton from './ActionButton';
import Controls from './Controls';
import GeneralDisplay from './GeneralDisplay';
import Grid from './Grid';
import './styles/tetris.css';

export default function Tetris() {
    const [score, setScore] = useState(0);
    const [player, resetPlayer, updatePlayerPos, rotatePlayer] = usePlayer();
    const [grid, setGrid, rowsCleared, setRowsCleared] = useGrid(player, resetPlayer, setScore);
    const [gameOver, setGameOver] = useState(false);
    const [pause, setPause] = useState(false);
    const [dropTime, setDropTime] = useState(null);
    const [coolDown, setCoolDown] = useState(false);
    const [horizontalCoolDown, setHorizontalCoolDown] = useState(false);
    const [dropCoolDown, setDropCoolDown] = useState(false);

    const setDropSpeed = () => {
        if(rowsCleared < 10){
            setDropTime(800);
        } else if(rowsCleared < 20){
            setDropTime(600);
        } else if(rowsCleared < 30){
            setDropTime(500);
        } else{
            setDropTime(400);
        }
    }

    useInterval(() => {
        moveDown(false);
    }, dropTime);

    console.log("re-render");

    const moveX = (dir) => {
        if(!horizontalCoolDown){
            if(!checkCollision(player, grid, { x: dir, y: 0 })){
                //This function only handles movement in the horizontal plane
                //hence y: 0 here
                updatePlayerPos({ x: dir, y: 0, collided: false });
                setHorizontalCoolDown(true);
            }
        } else{
            sleep(20).then(() => {
                setHorizontalCoolDown(false);
                moveX(dir);
            });
        }
    }

    const moveDown = (isFromUser) => {
        if(isFromUser){
            if(!coolDown){
                setDropSpeed();
                if(!checkCollision(player, grid, { x: 0, y: 1 })){
                    updatePlayerPos({ x: 0, y: 1, collided: false });
                } else{
                    if(player.pos.y < 1){
                        console.log("GAME OVER!");
                        setDropTime(null);
                        setGameOver(true);
                    }
                    updatePlayerPos({ x: 0, y: 0, collided: true });
                    setScore(prev => prev + 4);
                }
                setCoolDown(true);
            } else{
                sleep(30).then(() => {
                    setCoolDown(false);
                    moveDown(true);
                });
            }
        } else{
            setDropSpeed();
            if(!checkCollision(player, grid, { x: 0, y: 1 })){
                updatePlayerPos({ x: 0, y: 1, collided: false });
            } else{
                if(player.pos.y < 1){
                    console.log("GAME OVER!");
                    setDropTime(null);
                    setGameOver(true);
                }
                updatePlayerPos({ x: 0, y: 0, collided: true });
                setScore(prev => prev + 4);
            }
        }
    }

    const dropDown = () => {
        let row = 0;
        while(!checkCollision(player, grid, { x: 0, y: row }) && row <= STAGE_HEIGHT){
            row++;
        }

        if(dropCoolDown){
            sleep(30).then(() => {
                setDropCoolDown(false);
                updatePlayerPos({ x: 0, y: row - 1, collided: true });
                setScore(prev => prev + 4);
            });
        } else{
            setDropCoolDown(true);
            updatePlayerPos({ x: 0, y: row - 1, collided: true });
            setScore(prev => prev + 4);
        }
    }

    const down = (isFromUser) => {
        setDropTime(null);
        moveDown(isFromUser);
    }

    const drop = () => {
        setDropTime(null);
        dropDown();
    }

    const keyUp = ({ keyCode }) => {
        if (!gameOver && !pause) {
          // Activate the interval again when user releases down arrow.
          if (keyCode === 40 || keyCode === 38) {
            setDropSpeed();
          }
        }
      };

    const move = ({ keyCode }) => {
        if(!gameOver && !pause){
            //Left Arrow Key
            if(keyCode === 37) {
                moveX(-1);
            //Right Arrow Key
            } else if(keyCode === 39){
                moveX(1);
            //Down Arrow Key
            } else if(keyCode === 40){
                down(true);
            //Spacebar
            } else if(keyCode === 32){
                rotatePlayer(grid, 1);
            //Up Arrow Key
            } else if(keyCode === 38){
                drop();    
            } 
        }
        
        if(!gameOver){
            //Escape Key
            if(keyCode === 27){
                setPause(prevPause => !prevPause);
                if(pause){
                    setDropSpeed();
                } else{
                    setDropTime(null);
                }
            }
        }
    }

    const startGame = () => {
        setGrid(createGrid());
        setScore(0);
        setRowsCleared(0);
        setDropTime(800);
        resetPlayer();
        setGameOver(false);
        setPause(false);
        console.log("START");
    }

    return (
        <div className="main-container" 
             onKeyDown={e => move(e)}
             tabIndex="0"
             onKeyUp={keyUp}>
            <div className="content">
                <Grid grid={grid} />
                {pause && 
                    <div className="pause-screen">
                        <h1 style={{fontSize: "3.5rem"}}>Pause</h1>
                        <small style={{fontSize: "2rem"}}>Press ESC to Resume</small>
                    </div>}
                {gameOver && <h1 className="game-over">Game Over</h1>}
                <div className="display-container">
                    <GeneralDisplay value={score} text="SCORE:" />
                    <GeneralDisplay value={rowsCleared / 2} text="ROWS:" />
                    {gameOver ? (
                        <ActionButton text="RESTART" callback={startGame}/>
                    ) : (
                        <ActionButton text="START" callback={startGame}/>
                    )}
                    <Controls />
                </div>
            </div>
        </div>
    )
}
