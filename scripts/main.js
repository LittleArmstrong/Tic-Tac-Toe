"use strict";

const tictactoe = (() => {
   const WIN_COND = 3;
   let board = [];

   function createGameBoard(rows, cols) {
      board = createBoard(rows, cols);
   }

   function createBoard(rows, cols) {
      const board = [];
      let i = rows;
      while (i--) board.push(new Array(cols));
      return board;
   }

   function mark(row, col, playerChar) {
      board[row][col] = playerChar;
      console.log(board[row][col]);
      return (
         checkHorizontalWinCond(playerChar) ||
         checkVerticalWinCond(playerChar) ||
         checkDiagonalWinCond(playerChar)
      );
   }

   function checkHorizontalWinCond(playerChar) {
      for (let row = 0; row < board.length; row++) {
         let counter = 0;
         for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === playerChar) {
               counter++;
               if (counter === WIN_COND) return true;
            } else counter = 0;
         }
      }
      return false;
   }

   function checkVerticalWinCond(playerChar) {
      for (let col = 0; col < board[0].length; col++) {
         let counter = 0;
         for (let row = 0; row < board.length; row++) {
            if (board[row][col] === playerChar) {
               counter++;
               if (counter === WIN_COND) return true;
            } else counter = 0;
         }
      }
      return false;
   }

   function checkDiagonalWinCond(playerChar) {
      for (let row = 0; row < board.length; row++) {
         for (let col = 0; col < board[row].length; col++) {
            let counter = 0;
            let diagonalRow = row;
            let diagonalCol = col;
            do {
               if (board[diagonalRow][diagonalCol] === playerChar) {
                  counter++;
                  if (counter === WIN_COND) return true;
               } else counter = 0;
               diagonalRow++;
               diagonalCol++;
            } while (diagonalRow < board.length && diagonalCol < board[diagonalRow - 1].length);

            counter = 0;
            diagonalRow = row;
            diagonalCol = col;
            do {
               if (board[diagonalRow][diagonalCol] === playerChar) {
                  counter++;
                  if (counter === WIN_COND) return true;
               } else counter = 0;
               diagonalRow++;
               diagonalCol--;
            } while (diagonalRow < board.length && diagonalCol > -1);
         }
      }
      return false;
   }

   function getBoard() {
      return board;
   }

   return { createGameBoard, mark, getBoard };
})();

tictactoe.createGameBoard(3, 3);

console.log(tictactoe.mark(0, 2, "x"));
console.log(tictactoe.mark(1, 1, "x"));
console.log(tictactoe.mark(2, 0, "x"));
let board = tictactoe.getBoard();
console.table(board);
