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


      const next = (vector) => createPosition(x + vector.getX(), y + vector.getY());

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

      //populate the board with cells
      for (let y = 1; y <= yCellsMax; y++) {
         for (let x = 1; x <= xCellsMax; x++) {
            board.push(createCell(x, y));
         }
      }

      /**
       * Get a copy of the board but with the references of the cells
       * @returns {Cell[]} a copy of the board
       */
      const get = () => [...board];
      /**
       * Get the specified cell from the board
       * @param {Position} position position of the cell
       * @returns {Cell} the cell object of that position from the board
       */
      const getCell = (position) => {
         const [x, y] = position.get();
         const index1D = (x - 1) + (y - 1) * xCellsMax;
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
      // const findStreakFrom = (cell) => {
      //    const directionVectors = {
      //       horizontal: [createVector(1, 0), createVector(1, 0).invert()],
      //       vertical: [createVector(0, 1), createVector(0, 1).invert()],
      //       diagonal1: [createVector(1, 1), createVector(1, 1).invert()],
      //       diagonal2: [createVector(1, -1), createVector(1, -1).invert()]
      //    };
      //    const coordinates = {
      //       horizontal: [],
      //       vertical: [],
      //       diagonal1: [],
      //       diagonal2: []
      //    };

      //    for (const [direction, unitVectors] of Object.entries(directionVectors)) {
      //       for (const vector of unitVectors) {
      //          coordinates[direction].push(...findStreak({ cell, vector }));
      //       }
      //    }
      //    return coordinates;
      // }

      /**
       * Find cells with same content in a streak in the given direction
       * @param {Cell} cell the cell to start the search
       * @param {Vector} vector the direction to search
       * @returns {Cell[]} an array with cells
       */
      const findStreak = (cell, vector) => {
         const char = cell.getContent();
         const coordinates = [];
         let currentCell = cell;
         let nextPosition = currentCell.getPosition().next(vector);
         let nextCell = getCell(nextPosition);
         while (nextCell?.getContent() === char) {
            coordinates.push(nextCell.getPosition());
            currentCell = nextCell;
         }
         return coordinates;
      }

      const findHorizontalStreak = (cell) => {
         const streak = [cell];
         const direction_right = createVector(1, 0);
         const direction_left = createVector(-1, 0);
         streak.push(
            ...findStreak(cell, direction_left),
            ...findStreak(cell, direction_right)
         );
         return streak;
      }

      let nodeContainer = null;

      /**
       * Set the nodeContainer
       * @param {Element} node board node containing the cell nodes
       */
      const setNodeContainer = (node) => {
         nodeContainer = node;
      }

      /**
       * Render the corresponding node of the cell
       * @param {Position} position board position of the cell
       * @returns nothing
       */
      const updateCellNode = (position) => {
         if (!nodeContainer) return
         const cell = getCell(position);
         const [x, y] = position.get();
         const cellNode = nodeContainer.querySelector(`[data-x="${x}"][data-y="${y}"]`);
         cellNode.innerText = cell.getContent();
      }


      const update = () => {
         board.forEach(cell => updateCellNode(cell.getPosition()));
      }

      return { get, reset, getCell, findHorizontalStreak, setNodeContainer, updateCellNode, update };
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

   /**   
    * @typedef {Object} TurnSystem
    * @property {Function} getCurrentPlayer get the player of the current turn
    * @property {Function} nextPlayer get the player of the next turn
   */

   /**
    * Create a turn object to control the player turn system
    * @param {Player[]} players the players playing the game
    * @param {Integer} startTurn the turn to start with
    * @returns {TurnSystem} a turn object 
    */
   const createTurnSystem = (players, startTurn = 0) => {
      const maxTurn = players.length - 1;
      let currentTurn = startTurn;

      /**
       * Calculate the next turn
       * @returns {Integer} the next turn 
       */
      const calculateNextTurn = () => currentTurn + 1 > maxTurn ? 0 : currentTurn + 1;

      /**
       * Get the player of the given turn
       * @param {Integer} turn turn of the player
       * @returns {Player} the player
       */
      const getPlayer = (turn) => players?.[turn];

      /**
       * Returns the player of the current turn
       * @returns {Player} the player of the current turn
       */
      const getCurrentPlayer = () => getPlayer(currentTurn);

      /**
       * Returns the next player
       * @returns {Player} the player of the next turn
       */
      const getNextPlayer = () => {
         return getPlayer(calculateNextTurn());
      }

      /**
       * Sets the next turn if valid.
       * @param {Integer} turn the next turn
       * @returns nothing
       */

      const setNextTurn = (turn = calculateNextTurn()) => {
         if (turn < 0 || turn > maxTurn) return
         currentTurn = turn;
      }

      return { getPlayer, getCurrentPlayer, getNextPlayer, setNextTurn }
   }

   return { createBoard, createPlayer, createTurnSystem, createPosition };
})();



const boardNode = document.getElementById("board");
const board = tictactoe.createBoard(3, 3);
board.setNodeContainer(boardNode);

const players = [
   tictactoe.createPlayer("Player_1", "X"),
   tictactoe.createPlayer("Player_2", "O")
];

const turnSystem = tictactoe.createTurnSystem(players);


const resetBtn = document.getElementById("reset-game");
resetBtn.addEventListener("click", (event) => {
   board.reset();
   board.update()
});

boardNode.addEventListener("click", function (event) {
   event.preventDefault()
   const cellNode = event.target;
   const position = tictactoe.createPosition(cellNode.dataset.x, cellNode.dataset.y);
   const cell = board.getCell(position);
   if (cell?.getContent()) return;

   const currentPlayer = turnSystem.getCurrentPlayer();
   const playerChar = currentPlayer.getChar();
   cell.setContentTo(playerChar);

   board.updateCellNode(position);
   const horizontalStreak = board.findHorizontalStreak(cell);

   turnSystem.setNextTurn();
})

