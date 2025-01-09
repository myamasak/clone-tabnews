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
      const boardCopy = newBoard.map(row => [...row]);
      addRandomTile(boardCopy);
      setBoard(boardCopy);
    }
};

  const moveLeft = () => {
    const newBoard = board.map(row => {
      // First, remove all zeros and get numbers only
      let numbers = row.filter(cell => cell !== 0);
      
      // Merge adjacent equal numbers
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] === numbers[i + 1]) {
          numbers[i] *= 2;
          numbers.splice(i + 1, 1);
        }
      }
      
      // Add zeros to the end to maintain grid size
      while (numbers.length < 4) {
        numbers.push(0);
      }
      
      return numbers;
    });
    return newBoard;
  };
  
  const moveRight = () => {
    const newBoard = board.map(row => {
      // First, remove all zeros and get numbers only
      let numbers = row.filter(cell => cell !== 0);
      
      // Merge adjacent equal numbers from right to left
      for (let i = numbers.length - 1; i > 0; i--) {
        if (numbers[i] === numbers[i - 1]) {
          numbers[i] *= 2;
          numbers.splice(i - 1, 1);
          i--;
        }
      }
      
      // Add zeros to the start to maintain grid size
      while (numbers.length < 4) {
        numbers.unshift(0);
      }
      
      return numbers;
    });
    return newBoard;
  };
  
  const moveUp = () => {
    const transposed = transpose(board);
    const moved = transposed.map(row => {
      let numbers = row.filter(cell => cell !== 0);
      
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] === numbers[i + 1]) {
          numbers[i] *= 2;
          numbers.splice(i + 1, 1);
        }
      }
      
      while (numbers.length < 4) {
        numbers.push(0);
      }
      
      return numbers;
    });
    return transpose(moved);
  };
  
  const moveDown = () => {
    const transposed = transpose(board);
    const moved = transposed.map(row => {
      let numbers = row.filter(cell => cell !== 0);
      
      for (let i = numbers.length - 1; i > 0; i--) {
        if (numbers[i] === numbers[i - 1]) {
          numbers[i] *= 2;
          numbers.splice(i - 1, 1);
          i--;
        }
      }
      
      while (numbers.length < 4) {
        numbers.unshift(0);
      }
      
      return numbers;
    });
    return transpose(moved);
  };

  const transpose = (matrix) => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
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