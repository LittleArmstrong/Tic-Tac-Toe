'use strict';
/**
 * @module tictactoe
 */
const tictactoe = (() => {
   /**   
    * @typedef {Object} Position
    * @property {Function} get get the position of the cell
    * @property {Function} getX get the position of the cell
    * @property {Function} getY get the current content of the cell
   */

   /**
    * Creates a Position Object
    * @param {Integer} x x coordinate
    * @param {Integer} y y coordinate
    * @returns {Position}
    */
   function createPosition(x, y) {
      /**
       * 
       * @returns {[x: integer, y: integer]} vector as array
       */
      const get = () => [x, y];
      /**
       * 
       * @returns {integer} x coordinate
       */
      const getX = () => x;
      /**
       * 
       * @returns {integer} y coordinate
       */
      const getY = () => y;


      const next = (vector) => createPosition(x + vector.getX, y + vector.getY);

      return { get, getX, getY, next };
   }

   /**   
    * @typedef {Object} Vector
    * @property {Function} get get the position of the cell
    * @property {Function} getX get the position of the cell
    * @property {Function} getY get the current content of the cell
    * @property {Function} invert clears the current content (empty string)
   */

   /**
    * Creates a Vector Object
    * @param {Integer} x x coordinate
    * @param {Integer} y y coordinate
    * @returns {Vector}
    */
   function createVector(x, y) {
      const { get, getX, getY } = createPosition(x, y);

      /**
       * 
       * @returns {Vector} inverted
       */
      const invert = () => createVector(-1 * x, -1 * y);

      return { get, getX, getY, invert };
   }

   /**   
    * @typedef {Object} Cell
    * @property {Function} getPosition get the position of the cell
    * @property {Function} setContentTo set the content of the cell
    * @property {Function} getContent get the current content of the cell
    * @property {Function} clearContent clears the current content (empty string)
    * @property {Function} isFilled checks if the content is not empty
   */

   /**
    * Creates a Cell object
    * @param {Integer} x x coordinate
    * @param {Integer} y y coordinate
    * @returns {Cell} cell with the set position
    */

   function createCell(x, y) {
      const position = createPosition(x, y);
      let content = "";

      const setContentTo = (newContent) => content = newContent;
      const getContent = () => content;
      const clearContent = () => content = "";
      // const hasSameContent = (content) => _content === content;

      const isFilled = () => content !== "";

      const getPosition = () => position;

      return { getPosition, setContentTo, getContent, clearContent, isFilled };
   }

   /** 
    * @typedef {Object} Board
    * @property {Function} get all the cells in an array
    * @property {Function} reset the board and clear all content
    * @property {Function} getCell at the given position
    * @property {Function} findStreakFrom the given cell for each axis direction
    */

   /**
    * Creates a tictactoe board with the given amount of cells
    * @param {Integer} xCellsMax max number of cells in x direction
    * @param {Integer} yCellsMax max number of cell in y direction
    * @returns {Board} a board object
    */

   function createBoard(xCellsMax, yCellsMax) {
      const board = [];
      for (let y = 0; y < yCellsMax; y++) {
         for (let x = 0; x < xCellsMax; x++) {
            board.push(createCell(x, y));
         }
      }

      const get = () => [...board];
      /**
       * Get the specified cell from the board
       * @param {Position} position position of the cell
       * @returns {Cell} the cell object of that position from the board
       */
      const getCell = (position) => {
         const index1D = position.getX() + position.getY() * xCellsMax;
         return board?.[index1D];
      }
      const reset = () => board.forEach(cell => cell.clearContent())

      // const next = (vector) => _Board.getCell(_position.next(vector));

      /**   
       * @typedef {Object} AxisCoordinates
       * @property {Cell[]} horizontal cells along the horizontal axis
       * @property {Cell[]} vertical cells along the vertical axis
       * @property {Cell[]} diagonal1 cells along the diagonal1 (\) axis
       * @property {Cell[]} diagonal2 cells along the diagonal2 (/) axis
       */

      /**
       * Finds cells with the same content as given cell
       * in each axis directions
       * @param {Cell} cell starting cell
       * @returns {AxisCoordinates} the cells for each axis direction
       */
      const findStreakFrom = (cell) => {
         const directionVectors = {
            horizontal: [createVector(1, 0), createVector(1, 0).invert()],
            vertical: [createVector(0, 1), createVector(0, 1).invert()],
            diagonal1: [createVector(1, 1), createVector(1, 1).invert()],
            diagonal2: [createVector(1, -1), createVector(1, -1).invert()]
         };
         const coordinates = {
            horizontal: [cell.getPosition()],
            vertical: [cell.getPosition()],
            diagonal1: [cell.getPosition()],
            diagonal2: [cell.getPosition()]
         };

         for (const [direction, unitVectors] of Object.entries(directionVectors)) {
            for (const vector of unitVectors) {
               let currentCell = cell;
               let nextCell = board.getCell(currentCell.getPosition().next(vector));
               while (currentCell.getContent() === nextCell?.getContent()) {
                  coordinates[direction].push(nextCell);
                  currentCell = nextCell;
               }
            }
         }
         return coordinates;
      }
      return { get, reset, getCell, findStreakFrom };
   }

   /**   
    * @typedef {Object} Player
    * @property {Function} getName get the name of the player
    * @property {Function} getChar set the chosen char of the player
    * @property {Function} pushPosition save the marked position of the player
    * @property {Function} getPositions get all the marked positions of the player
    * @property {Function} hasPosition checks if the player has already marked the given position
   */

   /**
    * Create a Player object
    * @param {String} initName the initial name of the player
    * @param {String} initChar the initial char of the player
    * @returns {Player} a Player object 
    */

   function createPlayer(initName, initChar) {
      const positions = [];
      const name = initName;
      const char = initChar;

      /**
       * Get the name of the player
       * @returns the name of the player
       */
      const getName = () => name;
      /**
       * Get the chosen char of the player
       * @returns the chosen char of the player
       */
      const getChar = () => char;
      /**
       * Save the marked position of the player
       * @param {Position} position the marked position to save
       * @returns nothing
       */
      const pushPosition = (position) => positions.push(position);
      /**
       * Get an array of marked positions of the player
       * @returns {Position[]} the marked positions of the player
       */
      const getPositions = () => [...positions];
      /**
       * Check if the given position is already marked by this player
       * @param {Position} position the position to check
       * @returns {Boolean} true if the given position is already marked by this player
       */
      const hasPosition = (position) => positions.includes(position);

      return { getName, getChar, getPositions, pushPosition, hasPosition };
   }

   return { createBoard, createPlayer };
})();

const boardNode = document.getElementById("board");
boardNode.addEventListener("click", function (event) {
   const cellNode = event.target;
   console.log(event.target)
})