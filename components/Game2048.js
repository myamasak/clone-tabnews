import { useState, useEffect } from 'react';
import styles from './Game2048.module.css';

function Game2048() {
  const [board, setBoard] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);

  const initializeBoard = () => {
    const newBoard = [...board];
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
  };

  const addRandomTile = (gameBoard) => {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (gameBoard[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }
    
    if (emptyTiles.length > 0) {
      const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      gameBoard[randomTile.x][randomTile.y] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const handleKeyPress = (event) => {
    let newBoard;
    switch(event.key) {
      case 'ArrowUp':
        newBoard = moveUp();
        break;
      case 'ArrowDown':
        newBoard = moveDown();
        break;
      case 'ArrowLeft':
        newBoard = moveLeft();
        break;
      case 'ArrowRight':
        newBoard = moveRight();
        break;
      default:
        return;
    }
    
    if (newBoard && JSON.stringify(newBoard) !== JSON.stringify(board)) {
      addRandomTile(newBoard);
      setBoard([...newBoard]);
    }
  };

  const moveLeft = () => {
    const newBoard = board.map(row => {
      const filteredRow = row.filter(cell => cell !== 0);
      for(let i = 0; i < filteredRow.length - 1; i++) {
        if(filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
        }
      }
      const finalRow = filteredRow.filter(cell => cell !== 0);
      while(finalRow.length < 4) {
        finalRow.push(0);
      }
      return finalRow;
    });
    return newBoard;
  };

  const moveRight = () => {
    const newBoard = board.map(row => {
      const filteredRow = row.filter(cell => cell !== 0);
      for(let i = filteredRow.length - 1; i > 0; i--) {
        if(filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          filteredRow[i - 1] = 0;
        }
      }
      const finalRow = filteredRow.filter(cell => cell !== 0);
      while(finalRow.length < 4) {
        finalRow.unshift(0);
      }
      return finalRow;
    });
    return newBoard;
  };

  const moveUp = () => {
    const transposed = transpose(board);
    const moved = transposed.map(row => {
      const filteredRow = row.filter(cell => cell !== 0);
      for(let i = 0; i < filteredRow.length - 1; i++) {
        if(filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
        }
      }
      const finalRow = filteredRow.filter(cell => cell !== 0);
      while(finalRow.length < 4) {
        finalRow.push(0);
      }
      return finalRow;
    });
    return transpose(moved);
  };

  const moveDown = () => {
    const transposed = transpose(board);
    const moved = transposed.map(row => {
      const filteredRow = row.filter(cell => cell !== 0);
      for(let i = filteredRow.length - 1; i > 0; i--) {
        if(filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          filteredRow[i - 1] = 0;
        }
      }
      const finalRow = filteredRow.filter(cell => cell !== 0);
      while(finalRow.length < 4) {
        finalRow.unshift(0);
      }
      return finalRow;
    });
    return transpose(moved);
  };

  const transpose = (matrix) => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  };

  useEffect(() => {
    initializeBoard();
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // Empty dependency array

  return (
    <div className={styles.gameContainer}>
      <div className={styles.grid}>
        {board.map((row, i) => (
          <div key={i} className={styles.row}>
            {row.map((cell, j) => (
              <div key={`${i}-${j}`} className={styles.cell}>
                {cell !== 0 ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game2048;