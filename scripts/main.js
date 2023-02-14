const board = [
   ["x", "", ""],
   ["", "x", ""],
   ["", " ", "x"],
];

function getWinCoord(row, col, board, winCond) {
   const directions = {
      horizontal: [
         [0, 1],
         [0, -1],
      ],
      vertical: [
         [1, 0],
         [-1, 0],
      ],
      diagonal1: [
         [1, 1],
         [-1, -1],
      ],
      diagonal2: [
         [1, -1],
         [-1, 1],
      ],
   };
   const playerChar = board[row][col];
   const coords = [
      [row, col],
      [row, col],
   ];

   for (let [_, steps] of Object.entries(directions)) {
      let counter = 1;
      for (let index = 0; index < steps.length; index++) {
         let [rowStep, colStep] = steps[index];
         let iRow = row + rowStep;
         let iCol = col + colStep;
         while (board?.[iRow]?.[iCol] === playerChar) {
            counter++;
            iRow += rowStep;
            iCol += colStep;
         }
         coords[index] = [iRow - rowStep, iCol - colStep];
         if (counter >= winCond) {
            return { start: coords[0], end: coords[1] };
         }
      }
   }
}
const coords = getWinCoord(1, 1, board, 3);
console.log(coords);
