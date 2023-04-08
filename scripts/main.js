'use strict';

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
   const ROW = 0;
   const COL = 1;
   const stepsForAxis = {
      horizontal:    [[0, 1], [0, -1]],  // -
      vertical:      [[1, 0], [-1, 0]],  // |
      diagonalLeft:  [[1, 1], [-1, -1]], // \
      diagonalRight: [[1, -1], [-1, 1]], // /
   }

   /**
    * @typedef {Array.<Array.<string>>} Board
    */
   const board = [];
   const players = [];
   const winningLineLength = 3;
   /**
    * Public
    *
    * Create a 2D board for playing tic tac toe.
    *
    * @param {number} rows Number of rows
    * @param {number} cols Number of columns
    * @returns {Array.<Array.<string>>} a 2D Array of empty strings
    */
   function createBoard(rows, cols) {
      board.length = 0;
      for (let i = 0; i < rows; i++) board.push(new Array(cols));
      return getBoard();
   }

   /**
    * Public
    *
    * Clear the current board
    *
    * @returns {Array.<Array.<string>>} a 2D Array of empty strings
    */

   function resetBoard() {
      board.forEach(row => row.fill(''));
   }

   /**
    * Public
    *
    * Retuns the current game board
    *
    * @returns {Board} the 2D board
    */

   const getBoard = () => {
      return [...board];
   }

    /**
       * Mark the board at the given coordinate if empty
       *
       * @param {number} row The row containing the mark
       * @param {number} col The column containing mark
       * @returns {boolean} whether the board was successfully marked or not
       */

   const markBoardAt = (row, col) => {
      if (board[row][col]) return false;
      board[row][col] = char;
      return true;
   };

   const getCharAt = (row, col) => board?.[row]?.[col];


   function Player(name, char) {
      const getName = () => name;
      const getChar = () => char;

      const findWinningLineFrom = (startRow, startCol) => {
         let row = startRow;
         let col = startCol;
         for (const stepsForDirections of Object.values(stepsForAxis)){
            const lineCoordinates = [];
            for (const steps in stepsForDirections){
               while (isOwnCharAt(row, col)) {
                  lineCoordinates.push([row, col]);
                  if (lineCoordinates.length >= winningLineLength) return lineCoordinates;
                  row += steps[ROW];
                  col += steps[COL];
               }
            };
         }
         return [];
      };

      const isOwnCharAt = (row, col) => getCharAt(row, col) === char


      return { getName, getChar, findWinningLineFrom };
   }

   function createPlayer(name, char) {
      const player = Player(name, char);
      players.push(player);
      return player;
   }

   return { createBoard, getBoard, resetBoard, markBoardAt, createPlayer };
})();

tictactoe.createBoard(3, 3);
