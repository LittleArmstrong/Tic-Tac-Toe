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
   const setName = (newName) => name = newName;

   return { getName, getToken, setName };
}

const gameController = (function () {
   const event = {
      gameWon: 0,
      gameDraw: 1,
      continue: 2,

   };
   const status = { board: [], messages: { turn: '', winner: '' } };
   const board = Board();
   const playerOne = Player({ name: "Player One", token: "X" });
   const playerTwo = Player({ name: "Player Two", token: "O" });
   const players = [playerOne, playerTwo];
   const maxMoves = 9;

   let activePlayer = players[0];
   let gameFinished = false;
   let winner = null;
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
      setWinner(activePlayer);
      printWin();
   }

   const endDrawGame = () => {
      endGame();
      setWinner(null);
      printDraw();
   }

   const endGame = () => gameFinished = true;

   const setWinner = (player) => winner = player;

   const printWin = () => {
      printRound();
      console.log("YOU WIN: ", winner.getName());
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
      setWinner(null);
      resetMoveCounter();
      restartGame();
      switchPlayer();
      updateGameStats();
      printRound();

   }

   const restartGame = () => gameFinished = false;
   const resetMoveCounter = () => moveCounter = 0;

   const updateGameStats = () => {
      status.board = getCellValues();
      status.activePlayer = activePlayer;
      status.gameFinished = gameFinished;
      status.winner = winner;
   }

   const applySettings = (settings) => {
      playerOne.setName(settings.player1);
      playerTwo.setName(settings.player2);
   }

   printRound();
   updateGameStats();

   return { playRound, resetGame, status, applySettings }

})();

const boardContainer = document.getElementById("board");
const messageBar = document.getElementById('message-bar');

const setMessage = (message) => messageBar.value = message;
const setTurnMessage = (playerName) => messageBar.value = 'Your turn: ' + playerName;
setTurnMessage(gameController.status.activePlayer.getName());


boardContainer.addEventListener("click", (event) => {
   const [row, column] = event.target.dataset.point.split(",");
   gameController.playRound({ row, column });

   const { board } = gameController.status;
   event.target.textContent = board[row][column];
   setTurnMessage(gameController.status.activePlayer.getName());
   if (gameController.status.gameFinished) {
      const winner = gameController.status.winner;
      if (winner) setMessage('You WIN: ' + winner.getName());
      else setMessage("It's a DRAW");
   }
})

const resetBtn = document.getElementById("reset-game");
resetBtn.addEventListener("click", () => {
   gameController.resetGame();

   const { board } = gameController.status;
   boardContainer.childNodes.forEach((node) => {
      const [row, column] = node.dataset?.point.split(",") || [-1, -1];
      if (row !== -1) node.textContent = board[row][column];
   })
   setTurnMessage(gameController.status.activePlayer.getName());
})

const settingsBtn = document.getElementById('save-settings');
const settingsForm = document.getElementById('settings');

settingsBtn.addEventListener('click', (event) => {
   event.preventDefault();
   const settings = new FormData(settingsForm);
   gameController.applySettings(Object.fromEntries(settings));
})
