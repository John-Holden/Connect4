/* eslint-disable no-param-reassign */
// initialise game state

const emptyArr = (nRow, mCol) => {
  const arr = new Array(nRow + 1);
  for (let i = 0; i < nRow + 1; i++) {
    arr[i] = new Array(mCol);
    arr[i].fill(0);
  }
  return arr;
};

const transpose = (arr) => {
  const arrTrans = emptyArr(arr.length, arr[0].length);
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      arrTrans[j][i] = arr[i][j];
    }
  }
  return arrTrans;
};

const flip = (arr) => {
  const arrFlip = emptyArr(arr.length, arr[0].length);
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      arrFlip[i][j] = arr[i][arr[0].length - j - 1];
    }
  }
  return arrFlip;
};

const checkWinningLines = (arr, N) => {
  // takes 1 dimensional arr
  let connected = 1;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1] && arr[i] > 0) {
      connected++;
    } else { connected = 1; }
    if (connected === N) {
      return true;
    }
  }
  return false;
};

// sweep through either +ve or -ve diagonals
const diagonalise = (arr) => {
  const rows = arr.length;
  const cols = arr[0].length;
  let start = 0;
  const diagSweep = [];
  const startingPos = [];
  arr = arr.flat();
  // finding start positions
  for (start = 0; start < ((rows + 1) * cols); start += cols) {
    startingPos.push(start);
  }
  for (start = 1; start < cols; start++) {
    startingPos.push(start);
  }
  // sweep through ALL diagonals
  for (let index = 0; index < startingPos.length; index++) {
    const diagLine = [0];
    let point = startingPos[index];
    while (point < ((rows + 1) * cols)) {
      // iterate through SINGLE diagonal
      if (point < ((rows + 1) * cols)) {
        diagLine.push(arr[point]);
      } else {
        break;
      }
      point += cols + 1;
    }
    diagSweep.push(diagLine);
  }
  return diagSweep.flat();
};

// find horizontal, vertical and diagonal wins
const checkWins = (arr, N) => {
  if (checkWinningLines(arr.flat(), N)) {
    // horizontal
    return true;
  }
  if (checkWinningLines(transpose(arr).flat(), N)) {
    // vertical
    return true;
  }
  if (checkWinningLines(diagonalise(arr), N)) {
    // +ve diagonal
    return true;
  }
  if (checkWinningLines(diagonalise(flip(arr)), N)) {
    // -ve diagonal
    return true;
  }

  return false;
};

// fill board with token's
const fillBoard = (game, colClick) => {
  for (let i = 1; i < game.rows + 1; i++) {
    if (!game.board[i][colClick]) {
      game.board[i][colClick] = game.playerCount % 2;
      game.board[i][colClick]++;
      game.rowAnim = i;
      game.colAnim = colClick;
      return game;
    }
  }
  return game;
};

const gameState = {
  cols: 7,
  rows: 6,
  colAnim: undefined,
  rowAnim: undefined,
  connectN: 4,
  playerCount: 0,
  rWins: 0,
  yWins: 0,
  inPlay: true,
  winner: false,
};

gameState.board = emptyArr(gameState.rows, gameState.cols);
if (typeof module !== 'undefined') {
  module.exports = {
    gameState,
    emptyArr,
    checkWins,
    fillBoard,
  };
}