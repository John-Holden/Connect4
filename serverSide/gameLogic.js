/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
const cols = 7;
const rows = 6;
let colX = 0;
let rowY = 0;
const connectN = 4;
let rWins = 0;
let yWins = 0;
let playerCount = 0;
let inPlay = true;

// initialise empty board arr
const arrGet = (nRow, mCol) => {
  const arr = new Array(nRow + 1);
  for (let i = 0; i < nRow + 1; i++) {
    arr[i] = new Array(mCol);
    arr[i].fill(0);
  }
  return arr;
};

const mapState = (state) => ['⚪', '🟡', '🔴'][state];

const transpose = (arr) => {
  const arrTrans = arrGet(rows, cols);
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      arrTrans[j][i] = arr[i][j];
    }
  }
  return arrTrans;
};

const flip = (arr) => {
  const arrFlip = arrGet(rows, cols);
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      arrFlip[i][j] = arr[i][cols - j - 1];
    }
  }
  return arrFlip;
};

const checkWinningLines = (arr) => {
  // takes 1 dimensional arr
  let connected = 1;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1] && arr[i] > 0) {
      connected++;
    } else { connected = 1; }
    if (connected === connectN) {
      return true;
    }
  }
  return false;
};

// sweep through either +ve or -ve diagonals
const diagonalise = (arr) => {
  arr = arr.flat();
  let start = 0;
  const diagSweep = [];
  const startingPos = [];
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
const checkWins = (arr) => {
  if (checkWinningLines(arr.flat())) {
    // horizontal
    return true;
  }
  if (checkWinningLines(transpose(arr).flat())) {
    // vertical
    return true;
  }
  if (checkWinningLines(diagonalise(arr))) {
    // +ve diagonal
    return true;
  }
  if (checkWinningLines(diagonalise(flip(arr)))) {
    // -ve diagonal
    return true;
  }

  return false;
};

// fill board with token's
const fillBoard = (gameState, col) => {
  for (let i = 1; i < rows + 1; i++) {
    if (!gameState[i][col]) {
      gameState[i][col] = playerCount % 2;
      gameState[i][col]++;
      rowY = i;
      colX = col;
      return gameState;
    }
  }
  return gameState;
};