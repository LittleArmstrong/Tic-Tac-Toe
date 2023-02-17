"use strict";

const tictactoe = (() => {
   const WIN_COND = 3;
   let board = [];
   let winCoordinates = null;

   function createGameBoard(rows, cols) {
      board = createBoard(rows, cols);
   }

   function createBoard(rows, cols) {
      const board = [];
      for (let i = 0; i < rows; i++) board.push(new Array(cols));
      return board;
   }

   function mark(row, col, playerChar) {
      if (board[row][col]) return false;
      board[row][col] = playerChar;
      winCoordinates = calculateWinCoordinates(row, col, board, WIN_COND) ?? null;
      return true;
   }

   function getBoard() {
      return board;
   }

   function calculateWinCoordinates(row, col, board, winCond) {
      //the directions to search in and the steps added starting from the set origin
      //e.g. the right and left side of the horizontal axis
      const searchDirections = {
         horizontal: [
            [0, 1],
            [0, -1],
         ],
         vertical: [
            [1, 0],
            [-1, 0],
         ],
         diagonal1: [
            [1, 1],
            [-1, -1],
         ],
         diagonal2: [
            [1, -1],
            [-1, 1],
         ],
      };
      const searchChar = board[row][col];
      const winCoordinates = [
         [row, col],
         [row, col],
      ];
      //iterate the board starting from the set origin
      for (let [direction, steps] of Object.entries(searchDirections)) {
         //reset counter for every direction
         let counter = 1; //1 because origin is search character and automatically counted
         for (let index = 0; index < steps.length; index++) {
            //check both sides of the direction starting from origin coordinates
            //add the steps so the origin character isn't counted again
            let [rowStep, colStep] = steps[index];
            let iRow = row + rowStep;
            let iCol = col + colStep;
            while (board?.[iRow]?.[iCol] === searchChar) {
               counter++;
               iRow += rowStep;
               iCol += colStep;
               //stop as soon as the win condition is met and save the start or end coordinates
               if (counter >= winCond) {
                  winCoordinates[index] = [iRow - rowStep, iCol - colStep];
                  return {
                     start: { row: winCoordinates[1][0], col: winCoordinates[1][1] },
                     end: { row: winCoordinates[0][0], col: winCoordinates[0][1] },
                     direction,
                  };
               }
            }
            //if the condition is not met, then save the last valid value for the
            //end coordinates
            winCoordinates[index] = [iRow - rowStep, iCol - colStep];
         }
      }
   }

   function getWinCoordinates() {
      return winCoordinates;
   }

   return { createGameBoard, mark, getBoard, getWinCoordinates };
})();

tictactoe.createGameBoard(3, 3);

console.log(tictactoe.mark(0, 0, "x"));
console.log(tictactoe.mark(1, 0, "x"));
console.log(tictactoe.mark(2, 0, "y"));
console.log(tictactoe.mark(2, 0, "x"));
console.table(tictactoe.getBoard());
