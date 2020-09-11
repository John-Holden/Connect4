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

// fill board, check wins & update board
const takeTurn = (event) => {
  const col = parseInt(event.target.id.split('-')[1], 10);
  const gameState = fillBoard(event.data.arr, col);
  if (checkWins(gameState)) {
    if (playerCount % 2 === 0) {
      yWins++; // update red token counter
      $('#yCount').text(yWins);
      $('#winMsg').css('color', 'yellow');
    } else { // update yellow token counter
      rWins++;
      $('#rCount').text(rWins);
      $('#winMsg').css('color', 'red');
    }
    inPlay = false;
    $('#winMsg').fadeIn(200);
    $('#winMsg').fadeOut(2500);
  }

  playerCount++;
  $('#grid').empty();
  renderBoard(gameState);
};

// Render gameState
const renderBoard = (gameState) => {
  const grid = $('#grid');
  for (let i = 0; i < gameState.length; i++) {
    const row = $('<div> </div>');
    row.attr('id', `row-${i}`);
    row.attr('class', 'row row-md-12');
    grid.prepend(row);
    for (let j = 0; j < gameState[0].length; j++) {
      if (i === 0) { // assign buttons to register take turn.
        const button = $('<button> </button>');
        button.attr('id', `button-${j}`);
        button.attr('class', 'btn btn-primary btn-lg counterButtons column');
        button.text('🖖');
        if (inPlay) {
          button.click({ arr: gameState }, takeTurn);
        }
        $(`#row-${i}`).append(button);
      } else {
        const column = $('<div> </div>');
        column.attr('id', `row-${i}-col-${j}`);
        if (playerCount > 0 && j === colX && i === rowY && gameState[i][j]) {
          // Apply animation if clicked
          const text = $('<div></div>');
          text.attr('class', 'movetxt');
          text.text(mapState(gameState[i][j]));
          column.attr('class', 'column cell');
          column.text('⚪');
          column.append(text);
        } else {
          column.attr('class', 'columm');
          column.text(mapState(gameState[i][j]));
        }
        $(`#row-${i}`).append(column);
      }
    }
  }
  return grid;
};

const resetBoard = () => {
  inPlay = true;
  $('#grid').empty();
  renderBoard(arrGet(rows, cols));
};

const resetCounter = () => {
  rWins = 0;
  yWins = 0;
  const rCount = $('#rCount').text(rWins);
  const yCount = $('#yCount').text(rWins);
  rCount.text(rWins);
  yCount.text(yWins);
};
const arr = arrGet(rows, cols);
renderBoard(arr);

$('#resetBoard').click(resetBoard);
$('#resetCount').click(resetCounter);