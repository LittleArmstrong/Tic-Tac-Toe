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

   const _board = [];
   const _players = [];

   let _boardRows = null;
   let _boardCols = null;
   let _turn = 0;
   let _winCondition = 3;
   let _winCoordinates = null;
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
      const board = _createBoard(rows, cols);
      _board.length = 0;
      _board.push(...board); //to not create a new array and save reference
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
      return createGameBoard(_boardRows, _boardCols);
   }

   /**
    * Private
    *
    * Create the 2D game board
    *
    * @param {number} rows Number of rows
    * @param {number} cols Number of columns
    * @returns
    */

   function _createBoard(rows, cols) {
      const board = [];
      for (let i = 0; i < rows; i++) board.push(new Array(cols));
      return board;
   }

   /**
    * Public
    *
    * Mark the board at the given coordinate if empty
    *
    * @param {number} row The row containing the mark
    * @param {number} col The column containing mark
    * @returns {boolean} whether the board was successfully marked or not
    */

   function mark(row, col) {
      if (_board[row][col] || _players.length === 0) return false;
      _board[row][col] = _players[_turn].getChar();
      _winCoordinates = calculateWinCoordinates(row, col, _board, _winCondition) ?? null;
      _turn = nextTurn(_turn, _players - length);
      return true;
   }

   /**
    * Public
    *
    * Retuns the current game board
    *
    * @returns {Board} the 2D board
    */

   function getBoard() {
      return _board;
   }

   /**
    * Private
    *
    * Get the winning coordinates of the winning line if any
    *
    * @param {number} row The row containing the starting cell
    * @param {number} col The column containing the starting cell
    * @param {Board} board The board to check the win condition
    * @param {number} winCond The number of adjacent chars needed
    * @returns {Line|Object} the coordinates of the adjacent chars in a line that won or an empty object if not
    */

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

      return {};
   }

   /**
    * Public
    *
    * Returns the winning coordinates of the current board
    *
    * @returns {Line} the winning coordinates of the current board
    */
   function getWinCoordinates() {
      return _winCoordinates;
   }

   function Player(name, char) {
      const getName = () => name;
      const getChar = () => char;
      return { getName, getChar };
   }

   function createPlayer(name, char) {
      const player = Player(name, char);
      _players.push(player);
      return player;
   }

   function nextTurn(currentTurn, maxTurn) {
      return currentTurn + 1 < maxTurn ? currentTurn + 1 : 0;
   }

   return { createGameBoard, mark, getBoard, getWinCoordinates, resetGameBoard, createPlayer };
})();

tictactoe.createGameBoard(3, 3);

console.log(tictactoe.mark(0, 0, "x"));
console.log(tictactoe.mark(1, 0, "x"));
console.log(tictactoe.mark(2, 0, "y"));
console.log(tictactoe.mark(2, 0, "x"));
console.table(tictactoe.getBoard());
console.log(tictactoe.resetGameBoard());
const player = tictactoe.createPlayer("baris", "x");
console.log(player.getName(), player.getChar());
