function Board() {
   const rows = 3;
   const columns = 3;
   const board = [];

   //populate board
   for (let row = 0; row < rows; row++) {
      board.push([]);
      for (let column = 0; column < columns; column++) {
         board[row].push(Cell());
      }
   }

   const get = () => board;
   const getCell = ({ row, column }) => board[row][column];
   const isMarked = ({ row, column }) => getCell({ row, column }).isMarked();
   const clear = () => {
      board.forEach(row => row.forEach(cell => cell.clear()));
   }
   return { get, getCell, isMarked, clear };
}

function Cell() {
   let value = "";

   const mark = (newValue) => value = newValue;
   const isMarked = () => !!value;
   const getValue = () => value;
   const clear = () => value = "";

   return { mark, getValue, clear, isMarked };
}

function Player({ name, token }) {
   const getName = () => name;
   const getToken = () => token;

   return { getName, getToken };
}

const gameController = (function () {
   const event = {
      gameWon: 0,
      gameDraw: 1,
      continue: 2,

   };
   const stats = { boardValues: [] };
   const board = Board();
   const playerOne = Player({ name: "Player One", token: "X" });
   const playerTwo = Player({ name: "Player Two", token: "O" });
   const players = [playerOne, playerTwo];
   const maxMoves = 9;

   let activePlayer = players[0];
   let gameFinished = false;
   let moveCounter = 0;
   let eventStack = [];



   const playRound = ({ row, column }) => {
      if (board.isMarked({ row, column }) || gameFinished) return;
      markBoardCell({ row, column });
      incrementMoveCounter();
      evaluateBoard();
      handleEvents();
      updateGameStats();
   }

   const markBoardCell = ({ row, column }) => {
      board
         .getCell({ row, column })
         .mark(activePlayer.getToken());
   }

   const incrementMoveCounter = () => {
      moveCounter++;
   }

   const evaluateBoard = () => {
      if (findWinningLine(activePlayer)) eventStack.push(event.gameWon)
      else if (markedLastCell()) eventStack.push(event.gameDraw)
      else eventStack.push(event.continue)
   }

   const possibleWinningLines = [
      //columns
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      //rows
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      //diagonal
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
   ]

   const findWinningLine = () => {
      const winningLineLength = 3;
      for (const possibleWinningLine of possibleWinningLines) {
         const line = possibleWinningLine.filter(point => {
            const [row, column] = point;
            const cell = board.getCell({ row, column });
            if (cell.getValue() === activePlayer.getToken()) return true;
         })
         if (line.length >= winningLineLength) return line;
      }
   }

   const markedLastCell = () => moveCounter >= maxMoves;

   const handleEvents = () => {
      while (eventStack.length) {
         switch (eventStack.shift()) {
            case event.gameWon:
               endWonGame();
               break;

            case event.gameDraw:
               endDrawGame();
               break;

            case event.continue:
               prepareNextRound();
               break;

            default:
               break;
         }
      }
   }

   const endWonGame = () => {
      endGame();
      printWin();
   }

   const endDrawGame = () => {
      endGame();
      printDraw();
   }

   const endGame = () => gameFinished = true;

   const printWin = () => {
      printRound();
      console.log("YOU WIN: ", activePlayer.getName());
   }

   const printDraw = () => {
      printRound();
      console.log("IT'S A DRAW");
   }

   const prepareNextRound = () => {
      switchPlayer()
      printRound();
   }

   const switchPlayer = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   }

   const printRound = () => {
      console.clear()
      console.log("Your turn: ", activePlayer.getName())
      console.table(getCellValues());
   }

   const getCellValues = () => board.get().map(row => row.map(cell => cell.getValue()));

   const resetGame = () => {
      board.clear();
      resetMoveCounter();
      restartGame();
      switchPlayer();
      updateGameStats();
      printRound();

   }

   const restartGame = () => gameFinished = false;
   const resetMoveCounter = () => moveCounter = 0;

   const updateGameStats = () => {
      stats.boardValues = getCellValues();
      console.log(stats);
   }

   printRound();

   return { playRound, resetGame, stats }

})();

const boardContainer = document.getElementById("board");


boardContainer.addEventListener("click", (event) => {
   const [row, column] = event.target.dataset.point.split(",");
   gameController.playRound({ row, column });

   const { boardValues } = gameController.stats;
   event.target.textContent = boardValues[row][column];
})

const resetBtn = document.getElementById("reset-game");
resetBtn.addEventListener("click", () => {
   gameController.resetGame();

   const { boardValues } = gameController.stats;
   boardContainer.childNodes.forEach((node) => {
      const [row, column] = node.dataset?.point.split(",") || [-1, -1];
      if (row !== -1) node.textContent = boardValues[row][column];
   })

})

