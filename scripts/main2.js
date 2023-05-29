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

   return { get, getCell };
}

function Cell() {
   let value = "";

   const setValue = (newValue) => value = newValue;
   const getValue = () => value;
   const clear = () => value = "";

   return { setValue, getValue, clear };
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
      const cell = board.getCell({ row, column });
      if (cell.getValue()) return;
      const token = activePlayer.getToken();
      cell.setValue(token);

      const winningLine = findWinningLine(activePlayer);
      if (winningLine) {
         printWin();
         return;
      }
      switchPlayer()
      printRound();
   }

   const switchPlayer = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   }

   const printRound = () => {
      const boardContent = board.get().map(row => row.map(cell => cell.getValue()));
      console.clear()
      console.log("Your turn: ", activePlayer.getName())
      console.table(boardContent);
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
            const cell = board.get()[row][column];
            if (cell.getValue() === activePlayer.getToken()) return true;
         })
         if (line.length >= winningLineLength) return line;
      }
      return;
   }

   const printWin = () => {
      printRound();
      console.log("YOU WIN: ", activePlayer.getName());
   }


   console.log("Your turn: ", activePlayer.getName());

   return { playRound }

})();

gameController.playRound({ row: 1, column: 0 });
gameController.playRound({ row: 1, column: 0 });
gameController.playRound({ row: 1, column: 1 });
gameController.playRound({ row: 0, column: 0 });
gameController.playRound({ row: 0, column: 1 });
gameController.playRound({ row: 2, column: 0 });

