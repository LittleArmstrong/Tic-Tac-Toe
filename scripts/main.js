"use strict";

const tictactoe = (() => {
   /**
    * @typedef {Object} Line
    * @property {Object} start      - The start coordinates
    * @property {number} start.col  - The column (y) coordinate
    * @property {number} start.row  - The row (y) coordinate
    * @property {Object} end        - The end coordinates
    * @property {number} end.col    - The column (x) coordinate
    * @property {number} end.row    - The row (x) coordinate
    * @property {string} direction  - The direction
    */

   /**
    * @typedef {Array.<Array.<string>>} Board
    */
   const SEARCH_DIRECTIONS = {
      VERTICAL: [
         [1, 0],
         [-1, 0],
      ],
      DIAGONAL_LEFT_UP: [
         [1, 1],
         [-1, -1],
      ],
      DIAGONAL_RIGHT_UP: [
         [1, -1],
         [-1, 1],
      ],
   };

   const _board = [];
   const _players = [];

   let _boardRows = null;
   let _boardCols = null;
   let _winningLineLength = 3;
   /**
    * Public
    *
    * Create a 2D board for playing tic tac toe.
    *
    * @param {number} rows Number of rows
    * @param {number} cols Number of columns
    * @returns {Array.<Array.<string>>} a 2D Array of empty strings
    */
   function createGameBoard(rows, cols) {
      _board.length = 0;
      for (let i = 0; i < rows; i++) _board.push(new Array(cols));
      _boardCols = cols;
      return getBoard();
   }

   /**
    * Public
    *
    * Clear the current board
    *
    * @returns {Array.<Array.<string>>} a 2D Array of empty strings
    */

   function resetGameBoard() {
      createGameBoard(_boardRows, _boardCols);
   }

   /**
    * Public
    *
    * Retuns the current game board
    *
    * @returns {Board} the 2D board
    */

   function getBoard() {
      return [..._board];
   }

   function Player(name, char) {
      const markCoordinates = [];
      const winningLineCoordinates = [];

      const getName = () => name;
      const getChar = () => char;

      /**
       * Mark the board at the given coordinate if empty
       *
       * @param {number} row The row containing the mark
       * @param {number} col The column containing mark
       * @returns {boolean} whether the board was successfully marked or not
       */

      const markBoardAt = (row, col) => {
         if (_board[row][col]) return false;
         _board[row][col] = char;
         markCoordinates.push([row, col]);
         return true;
      };

      const findtWinningLineFromBoard = () => {
         const winCoordinates = [
            [row, col],
            [row, col],
         ];
         for (let [direction, steps] of Object.entries(SEARCH_DIRECTIONS)) {
            let counter = 1; //1 because origin is search character and automatically counted
            for (let index = 0; index < steps.length; index++) {
               let [rowStep, colStep] = steps[index];
               let iRow = row + rowStep;
               let iCol = col + colStep;
               while (board?.[iRow]?.[iCol] === searchChar) {
                  counter++;
                  iRow += rowStep;
                  iCol += colStep;
                  if (counter >= winCond) {
                     winCoordinates[index] = [iRow - rowStep, iCol - colStep];
                     return {
                        start: { row: winCoordinates[1][0], col: winCoordinates[1][1] },
                        end: { row: winCoordinates[0][0], col: winCoordinates[0][1] },
                        direction,
                     };
                  }
               }
               winCoordinates[index] = [iRow - rowStep, iCol - colStep];
            }
         }
      };

      const _findHorizontalWinningLine = (startRow, startCol) => {
         const STEPS = [
            [0, 1],
            [0, -1],
         ];
         const ROW = 0;
         const COL = 1;

         const positions = [[startRow, startCol]];
         STEPS.forEach((step) => {
            let row = startRow + step[ROW];
            let col = startCol + step[COL];

            while (_board?.[row]?.[col] === char) {
               positions.push([startRow, col]);
               if (positions.length >= _winningLineLength) return positions;
               row += step[ROW];
               col += step[COL];
            }
         });
         return [];
      };

      const _findWinningLine = (startPosition, directions) => {
         const ROW = 0;
         const COL = 1;
         const positions = [startPosition];

         directions.forEach((stepsInDirection) => {
            let row = startPosition[ROW] + stepsInDirection[ROW];
            let col = startPosition[COL] + stepsInDirection[COL];

            while (_board?.[row]?.[col] === char) {
               positions.push([row, col]);
               if (positions.length >= _winningLineLength) return positions;
               row += stepsInDirection[ROW];
               col += stepsInDirection[COL];
            }
         });

         return [];
      };

      return { getName, getChar, markBoardAt };
   }

   function createPlayer(name, char) {
      const player = Player(name, char);
      _players.push(player);
      return player;
   }

   return { createGameBoard, getBoard, resetGameBoard, createPlayer };
})();

tictactoe.createGameBoard(3, 3);
