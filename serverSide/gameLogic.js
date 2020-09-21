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
  const arrTrans = emptyArr(arr.length - 1, arr[0].length);
  for (let i = 0; i < arr.length; i++) {
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
  // finding start positions to begin iterations
  for (start = 0; start < ((rows + 1) * cols); start += cols) {
    startingPos.push(start);
  }
  for (start = 1; start < cols - 1; start++) {
    startingPos.push(start);
  }
  // sweep through ALL diagonals with 'point'
  for (let index = 0; index < startingPos.length; index++) {
    const diagLine = [0]; //init new diagonal line
    let point = startingPos[index];
    while (point < (rows * cols)) {
      // iterate through SINGLE diagonal - break when 'point' reaches domain edge
      if (point < (rows * cols)) {
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
const fillBoard = (gameState, colClick, tokenVal) => {
  for (let i = 1; i < gameState.rows + 1; i++) {
    if (!gameState.board[i][colClick]) {
      gameState.board[i][colClick] = tokenVal;
      gameState.rowAnim = i;
      gameState.colAnim = colClick;
      return gameState;
    }
  }
};

const gameStates = [{
    // server data
    connectN: 4,
    rWins: 0,
    yWins: 0,
    winner: false,
  },
  // user data
  {
    cols: 7,
    rows: 6,
    inPlay: true,
    playerCount: 0,
    colAnim: undefined,
    rowAnim: undefined,
    board: emptyArr(6, 7),
  },
];

if (typeof module !== 'undefined') {
  module.exports = {
    gameStates,
    emptyArr,
    checkWins,
    fillBoard,
    flip,
    transpose,
    diagonalise,
    checkWinningLines,
  };
}