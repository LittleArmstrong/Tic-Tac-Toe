var board = [
   [" ", " ", " "],
   [" ", " ", " "],
   [" ", " ", " "],
];

var player1 = "X";
var player2 = "O";

function checkWin() {
   // Check rows
   for (var i = 0; i < 3; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== " ") {
         return board[i][0];
      }
   }

   // Check columns
   for (var i = 0; i < 3; i++) {
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== " ") {
         return board[0][i];
      }
   }

   // Check diagonals
   if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== " ") {
      return board[0][0];
   }
   if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== " ") {
      return board[0][2];
   }

   return null;
}

function makeMove(row, col, player) {
   if (board[row][col] === " ") {
      board[row][col] = player;
      var winner = checkWin();
      if (winner) {
         console.log(winner + " wins!");
      }
   } else {
      console.log("Invalid move. Try again.");
   }
}
