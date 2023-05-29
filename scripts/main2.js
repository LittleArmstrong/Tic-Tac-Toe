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
   return { get, getCell, isMarked };
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
   const board = Board();
   const playerOne = Player({ name: "Player One", token: "X" });
   const playerTwo = Player({ name: "Player Two", token: "O" });
   const players = [playerOne, playerTwo];

   let activePlayer = players[0];

   const playRound = ({ row, column }) => {
      if (board.isMarked({ row, column })) return;
      markBoardCell({ row, column });
      const event = evaluateBoard();
      handle(event);
   }

   const markBoardCell = ({ row, column }) => {
      board
         .getCell({ row, column })
         .mark(activePlayer.getToken());
   }

   const evaluateBoard = () => {
      const winningLine = findWinningLine(activePlayer);
      if (winningLine) return "win"
      else return "nothing"
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

   const handle = (event) => {
      switch (event) {
         case "win":
            endGame();
            break;

         case "nothing":
            prepareNextRound();
            break;

         default:
            break;
      }
   }

   const endGame = () => {
      printWin();
   }

   const printWin = () => {
      printRound();
      console.log("YOU WIN: ", activePlayer.getName());
   }

   const prepareNextRound = () => {
      switchPlayer()
      printRound();
   }

   const switchPlayer = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   }

   const printRound = () => {
      //create array from board with primitive values to show in console
      const boardContent = board.get().map(row => row.map(cell => cell.getValue()));
      console.clear()
      console.log("Your turn: ", activePlayer.getName())
      console.table(boardContent);
   }

   console.log("Your turn: ", activePlayer.getName());

   return { playRound }

})();
