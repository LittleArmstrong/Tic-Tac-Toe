'use strict';
/**
 * 
 */
const tictactoe = (() => {
   const settings = {
      MIN_STREAK_LENGTH: 3,
      MIN_CELL_WIDTH_IN_PX: 5,
      MIN_CELL_HEIGHT_IN_PX: 5,
      autoNextTurn: true
   }
   /** @type {Player[]} the players in the game*/
   const _players = [];
   /** @type {Board} the reference to the current board */
   let _Board = null;
   let _GUI = null;

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
            if (coordinates.length >= settings.MIN_STREAK_LENGTH) return coordinates
         }
         return [];
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
      return {getPosition, findWinningStreak, setContentTo, getContent, clearContent, 
         hasSameContent, next, isFilled};
   }

   function Board(xCellsMax, yCellsMax){   
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
   
      const _board = [];
      for (let y = 0; y < yCellsMax; y++) {
         for (let x = 0; x < xCellsMax; x++){
            _board.push(Cell(x, y));
         }         
      }

      const get = () => [..._board];
      /**
       * Get the specified cell from the board
       * @param {Position} position position of the cell
       * @returns {Cell} the cell object of that position from the board
       */
      const getCell = (position) => {
         const index1D = position.getX() + position.getY() * xCellsMax;
         return _board[index1D];
      }
      const reset = () => _board.forEach(cell => cell.clearContent())

      // /**
      //  * Marks the board at the chosen position
      //  * @param {Position} position position to mark
      //  * @param {String} char the char to use as mark
      //  * @returns nothing
      //  */
      // const markAt = (position, char) => {
      //    const cell = getCell(position);
      //    if (cell.getContent()) return;
      //    cell.setContentTo(char);
      // };
      const getCharAt = (position) => getCell(position).getContent();
      const isMarkedAt = (position) => getCharAt(position) ? true : false;

      let currentTurn = 0;
      const setTurnTo = (index) => currentTurn = index;
      const setNextTurn = () => {
         let nextTurn = currentTurn < _players.length ? currentTurn + 1 : 0;
         setTurnTo(nextTurn);
      }

      /**
          * Create a board gui for a container.
          * Returns a dcoumentFragment with cell nodes to append to that container.
          * 
          * @param {HTMLElement} container container for the board cells
          * @returns {DocumentFragment} document fragment with cell nodes 
          */
      const createGuiFor = (container) => {
         const cellWidth = container.clientWidth / xCellsMax;
         const cellHeight = container.clientHeight / yCellsMax;
         if (cellWidth < settings.MIN_CELL_WIDTH_IN_PX || cellHeight < settings.MIN_CELL_HEIGHT_IN_PX)
            throw new Error("Container height or width too small");

         const documentFragment = document.createDocumentFragment();
         for (let y = 0; y < yCellsMax; y++) {
            for (let x = 0; x < xCellsMax; x++){
               const cellNode = document.createElement("div");
               cellNode.setAttribute("data-x", x);
               cellNode.setAttribute("data-y", y);
               cellNode.addEventListener("click", (event) => {
                  const clickedCellNode = event.target;
                  const position = Position(clickedCellNode.dataset.x, clickedCellNode.dataset.y);
                  const cell = getCell(position);
                  if(cell.isFilled()) return;

                  const currentPlayer = _players?.[currentTurn];
                  if(!currentPlayer) throw Error("Invalid player");
                  cell.setContentTo(currentPlayer.getChar());

                  if(settings.autoNextTurn) setNextTurn();
               })
               documentFragment.appendChild(cellNode);
            }         
         }
      return documentFragment;
      }


      return {get, reset, isMarkedAt, getCharAt, getCell, createGuiFor, setTurnTo, setNextTurn};

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

   function getSettings(){
      return settings;
   }

   function changeSettings(newSettings){
      Object.assign(settings, newSettings);
   }

   return { createBoard, setBoard, getBoard, createPlayer, insertPlayer, getPlayers, getSettings, changeSettings };
})();