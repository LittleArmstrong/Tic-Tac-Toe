'use strict';
/**
 * 
 */
const tictactoe = (() => {
   const _players = [];
   let _Board = null;
   let _GUI = null;


   function Board(xCellsMax, yCellsMax){
      const MIN_STREAK_LENGTH = 3;
      const MIN_CELL_WIDTH_IN_PX = 5;
      const MIN_CELL_HEIGHT_IN_PX = 5;

      function Position(x, y){      
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
      
   
         const next = (vector) => Position(x + vector.getX, y + vector.getY);
   
         return {get, getX, getY, next};
      }
   
      /**
       * Creates a Vector Object
       * @param {integer} x x coordinate
       * @param {integer} y y coordinate
       * @returns {Vector}
       */
      function Vector(x, y) {
         const {get, getX, getY} = Position(x,y);
   
         /**
          * 
          * @returns {Vector} inverted
          */
         const invert = () => Vector(-1* x, -1* y);
   
         return {get, getX, getY, invert};
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
         /**
          * Create a board gui for a container.
          * Returns a dcoumentFragment to append to that container
          * 
          * @param {HTMLElement} container container for the board cells
          */

         const createGuiFor = (container) => {
            const cellWidth = container.clientWidth / xCellsMax;
            const cellHeight = container.clientHeight / yCellsMax;
            if (cellWidth < MIN_CELL_WIDTH_IN_PX || cellHeight < MIN_CELL_HEIGHT_IN_PX)
               throw new Error("Container height or width too small");
            const documentFragment = document.createDocumentFragment();
            const numOfCells = xCellsMax * yCellsMax;
            for(let i = 0; i < numOfCells; i++){
               const cell = document.createElement("div");
               // add player char of current turn if clicked and not full
               documentFragment.appendChild(cell);
            }
            
         }
   
         return {getPosition, findWinningStreak, setContentTo, getContent, clearContent, 
            hasSameContent, next, isFilled};
      }
   
      const _board = [];
      for (let y = 0; y < yCellsMax; y++) {
         for (let x = 0; x < xCellsMax; x++){
            _board.push(Cell(x, y));
         }         
      }
      const get = () => [..._board];
      const getCell = (position) => {
         const index1D = position.getX() + position.getY() * xCellsMax;
         return _board[index1D];
      }
      const reset = () => _board.forEach(cell => cell.clearContent())
      const markAt = (position) => {
         const cell = getCell(position);
         if (cell.getContent()) return;
         cell.setContentTo(char);
      };
      const getCharAt = (position) => getCell(position).getContent();
      const isMarkedAt = (position) => getCharAt(position) ? true : false;
      return {get, reset, markAt, isMarkedAt, getCharAt, getCell};

   }

   function Player(name, char) {
      const getName = () => name;
      const getChar = () => char;
      const hasCharAt = (row, col) => _Board.getCharAt(row, col) === char;
      return { getName, getChar, hasCharAt };
   }

   function createBoard(xMax, yMax) {
      return Board(xMax, yMax); 
   }

   function setBoard(board){
      _Board = board;
   }

   function getBoard(){
      return _Board;
   }

   function createPlayer(name, char) {
      const player = Player(name, char);
      return player;
   }

   function insertPlayer(player){
      _players.push(player);
   }

   function getPlayers(){
      return [..._players];
   }

   return { createBoard, setBoard, getBoard, createPlayer, insertPlayer, getPlayers };
})();

tictactoe.createBoard(3, 3);
const board = tictactoe.getBoard();
console.log(board.get());
