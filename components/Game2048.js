import { useState, useEffect } from 'react';
import styles from './Game2048.module.css';

function Game2048() {
  const [board, setBoard] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);
  const [score, setScore] = useState(0);

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
      const boardCopy = newBoard.map(row => [...row]);
      addRandomTile(boardCopy);
      setBoard(boardCopy);
    }
  };

  const moveLeft = () => {
    const newBoard = board.map(row => {
      let numbers = row.filter(cell => cell !== 0);
      let scoreIncrement = 0;
      
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] === numbers[i + 1]) {
          numbers[i] *= 2;
          scoreIncrement += numbers[i];
          numbers.splice(i + 1, 1);
        }
      }
      
      while (numbers.length < 4) {
        numbers.push(0);
      }
      
      setScore(prevScore => prevScore + scoreIncrement);
      return numbers;
    });
    return newBoard;
  };

  const moveRight = () => {
    const newBoard = board.map(row => {
      let numbers = row.filter(cell => cell !== 0);
      let scoreIncrement = 0;
      
      for (let i = numbers.length - 1; i > 0; i--) {
        if (numbers[i] === numbers[i - 1]) {
          numbers[i] *= 2;
          scoreIncrement += numbers[i];
          numbers.splice(i - 1, 1);
          i--;
        }
      }
      
      while (numbers.length < 4) {
        numbers.unshift(0);
      }
      
      setScore(prevScore => prevScore + scoreIncrement);
      return numbers;
    });
    return newBoard;
  };

  const moveUp = () => {
    const transposed = transpose(board);
    const moved = transposed.map(row => {
      let numbers = row.filter(cell => cell !== 0);
      let scoreIncrement = 0;
      
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] === numbers[i + 1]) {
          numbers[i] *= 2;
          scoreIncrement += numbers[i];
          numbers.splice(i + 1, 1);
        }
      }
      
      while (numbers.length < 4) {
        numbers.push(0);
      }
      
      setScore(prevScore => prevScore + scoreIncrement);
      return numbers;
    });
    return transpose(moved);
  };

  const moveDown = () => {
    const transposed = transpose(board);
    const moved = transposed.map(row => {
      let numbers = row.filter(cell => cell !== 0);
      let scoreIncrement = 0;
      
      for (let i = numbers.length - 1; i > 0; i--) {
        if (numbers[i] === numbers[i - 1]) {
          numbers[i] *= 2;
          scoreIncrement += numbers[i];
          numbers.splice(i - 1, 1);
          i--;
        }
      }
      
      while (numbers.length < 4) {
        numbers.unshift(0);
      }
      
      setScore(prevScore => prevScore + scoreIncrement);
      return numbers;
    });
    return transpose(moved);
  };

  const transpose = (matrix) => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  };


  // Add isGameOver function here
  const isGameOver = () => {
    // Check for any empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return false;
      }
    }

    // Check for possible merges horizontally and vertically
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === board[i][j + 1]) return false;
        if (board[j][i] === board[j + 1][i]) return false;
      }
    }

    return true;
  };

  useEffect(() => {
    initializeBoard();
  }, []); // Empty dependency array for initialization on mount

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [board]); // Add board to dependency array

// Replace the return statement with this
return (
  <div className={styles.gameContainer}>
    <div className={styles.scoreContainer}>
      <h2>Score: {score}</h2>
      {isGameOver() && (
        <div style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '24px' }}>
          Game Over! Final Score: {score}
        </div>
      )}
    </div>
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