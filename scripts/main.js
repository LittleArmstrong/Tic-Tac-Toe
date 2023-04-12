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

   /**
    * @typedef {Array.<Array.<string>>} Board
    */
   const _players = [];
   const MIN_STREAK_LENGTH = 3;
   let _Board = null;

   function Vector(x, y) {
      const get = () => [x, y];
      const getX = () => x;
      const getY = () => y;

      const invert = () => Vector(-1* x, -1* y);

      return {get, getX, getY, invert};
   }

   function Position(x, y){      
      const {get, getX, getY} = Vector(x,y);

      const next = (directionVector) => Position(x + directionVector.getX, y + directionVector.getY);

      return {get, getX, getY, next};
   }

   function Cell(x, y){
      const _position = Position(x,y);
      let _content = "";

      const setContentTo = (content) => _content = content;
      const getContent = () => _content;
      const clearContent = () => _content = "";
      const hasSameContent = (content) => _content === content;

      const isFilled = () => _content !== "" && (_content ?? false) ; 

      const next = (vector) => _Board.getCell(_position.next(vector));

      const getPosition = () => _position;

      const findWinningStreak = () => {
         const directions = [Vector(1, 0), Vector(0, 1), Vector(1, 1), Vector(1, -1)];
         const coordinates = [];
         for (const vector of directions){
            coordinates.push(findStreakInAxis(vector));
            if (coordinates.length >= MIN_STREAK_LENGTH) return coordinates
         }
         return [];
      }

      const findStreakInAxis = (vector) => {
         const directions = [vector, vector.invert()];
         const cells = [this];
         let nextCell = cells[0].next(vector);
         for (const vector of directions) {
            while (nextCell.hasSameContent(_content)) {
               cells.push(nextCell);
               nextCell = cells[0].next(vector)
            } 
         }
         return cells;
      }

      return {getPosition, findWinningStreak, setContentTo, getContent, clearContent, 
         hasSameContent, next, isFilled};
   }


   function createBoard(rows, cols) {
      _Board = Board(rows, cols); 
      return _Board;
   }

   function Board(xMax, yMax){
      const _board = [];
      for (let y = 0; y < yMax; y++) {
         for (let x = 0; x < xMax; x++){
            _board.push(Cell(x, y));
         }         
      }

      /**
       * Retuns the game board
       *
       * @returns {Board} the 2D board
       */

      const get = () => _board;

      const getCell = (position) => {
         const index1D = position.getX() + position.getY() * xMax;
         return _board[index1D];
      }

      /**
       * Clear the current board
       *
       * @returns {Array.<Array.<string>>} a 2D Array of empty strings
       */

      const reset = () => _board.forEach(cell => cell.clearContent())


      /**
       * Mark the board at the given coordinate if empty
       *
       * @param {number} x The row containing the mark
       * @param {number} y The column containing mark
       * @returns {boolean} whether the board was successfully marked or not
       */

      const markAt = (position) => {
         const cell = getCell(position);
         if (cell.getContent()) return;
         cell.setContentTo(char);
      };

      const getCharAt = (position) => getCell(position).getContent();

      const isMarkedAt = (position) => getCharAt(position) ? true : false;

      return {get, reset, markAt, isMarkedAt, getCharAt, getCell};

   }

   function createPlayer(name, char) {
      const player = Player(name, char);
      _players.push(player);
      return player;
   }

   function Player(name, char) {
      const getName = () => name;
      const getChar = () => char;

      const hasCharAt = (row, col) => _board.getCharAt(row, col) === char;

      

      return { getName, getChar, hasCharAt };
   }



   return { createBoard, getBoard, resetBoard, markBoardAt, createPlayer };
})();

tictactoe.createBoard(3, 3);
