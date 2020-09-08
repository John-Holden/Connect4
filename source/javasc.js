const columns = 7;
const rows = 6;
const ytoken = '🟡';
const rtoken = '🔴';
const connectN = 4;
let rWins = 0;
let yWins = 0;
let playerCount = 1;
let winner = false;

// check for winner
function CheckWinner(onRow, onCol, jsArr) {
  // check vertical win
  let connectCount = 1;
  for (let i = 1; i < rows; i++) {
    if (jsArr[i][onCol] === null) {
      winner = false;
      break;
    } else if (jsArr[i][onCol] === jsArr[i + 1][onCol]) {
      connectCount += 1;
    } else {
      connectCount = 1; // if same as peice above add 1
    }
    if (connectCount === connectN) {
      winner = true;
      return winner;
    }
  }

  // check horizontal win
  connectCount = 1;
  for (let j = 0; j < columns - 1; j++) {
    if (jsArr[onRow][j] === null) {
      connectCount = 1;
    } else if (jsArr[onRow][j] === jsArr[onRow][j + 1]) {
      connectCount += 1;
    } else {
      connectCount = 1;
    }
    if (connectCount === connectN) {
      winner = true;
      return winner;
    }
  }
  // check diagonals
  // +ve diagonal
  let rowStart = onRow - Math.min(onRow - 1, onCol);
  let colStart = onCol - Math.min(onRow - 1, onCol);
  let numIter = Math.min(rows + 1 - rowStart, columns - colStart);
  connectCount = 1;
  for (let i = 0; i < numIter - 1; i++) {
    if (jsArr[rowStart + i][colStart + i] === null) {
      connectCount = 1;
    } else if (jsArr[rowStart + i][colStart + i] === jsArr[rowStart + i + 1][colStart + i + 1]) {
      connectCount += 1;
    } else {
      connectCount = 1;
    }
    if (connectCount === connectN) {
      winner = true;
      return winner;
    }
  }
  // -ve diagonal
  connectCount = 1;
  rowStart = onRow - Math.min(onRow - 1, columns - onCol);
  colStart = +onCol + +Math.min(onRow - 1, columns - onCol);
  numIter = Math.min(rows + 1 - rowStart, colStart + 1);
  connectCount = 1;
  for (let i = 0; i < numIter - 1; i++) {
    if (jsArr[rowStart + i][colStart - i] === null) {
      connectCount = 1;
    } else if (jsArr[rowStart + i][colStart - i] === jsArr[rowStart + i + 1][colStart - (i + 1)]) {
      connectCount += 1;
    } else {
      connectCount = 1;
    }
    if (connectCount === connectN) {
      winner = true;
      return winner;
    }
  }
  return winner;
}

// click function: update tokens
function takeTurn(event) {
  if (winner === false) { // execute if in-play
    const colClicked = event.target.id.split('-')[1];
    for (let i = 1; i < rows + 1; i++) {
      if (jsArr[i][colClicked] === null) {
        // $(`#row-${i}-col-${colClicked}`).remove();
        const buttonClick = $(`#row-${i}-col-${colClicked}`);
        buttonClick.attr('class', 'column movetxt');
        if (playerCount % 2 === 0) {
          buttonClick.text(ytoken);
        } else {
          buttonClick.text(rtoken);
        }
        jsArr[i][colClicked] = (playerCount % 2) + 1;
        winner = CheckWinner(i, colClicked, jsArr);
        if (winner) {
          if (playerCount % 2 === 0) {
            yWins++; // update red token counter
            $('#yCount').text(yWins);
          } else { // update yellow token counter
            rWins++;
            $('#rCount').text(rWins);
          }
          $('#winMsg').fadeIn(200);
          $('#winMsg').fadeOut(2500);
        }
        playerCount++;
        break;
      }
    }
    // if else, prompt to reset board
  } else if (winner) {
    console.log('winner...');
  }
}

// init empty board
function getBoard(rows, columns) {
  const jsArr = new Array(rows + 1);
  const grid = $('#grid');
  for (let i = 0; i < rows + 1; i++) {
    const row = $('<div> </div>');
    row.attr('id', `row-${i}`);
    row.attr('class', 'row row-md-12');
    grid.prepend(row);
    jsArr[i] = new Array(columns);
    jsArr[i].fill(null);
    for (let j = 0; j < columns; j++) {
      // set row of buttons
      if (i === 0) {
        const button = $('<button> </button>');
        button.attr('id', `button-${j}`);
        button.attr('class', 'btn btn-primary btn-lg myButtons column');
        button.text('🖖');
        button.click(takeTurn);
        $(`#row-${i}`).append(button);
      }
      // set bord elements
      else {
        const column = $('<div> </div>');
        column.attr('id', `row-${i}-col-${j}`);
        // column.attr('class', 'column fallingInit');
        column.attr('class', 'column movetxt');
        column.text('⚪');
        $(`#row-${i}`).append(column);
      }
    }
  }
  const rToken = $('#rCount');
  rToken.text(rWins);
  const yToken = $('#yCount');
  yToken.text(yWins);
  return jsArr;
}

// redefine board
function resetBoard(event) {
  console.log('reset Clicked');
  winner = false;
  for (let i = 1; i < rows + 1; i++) {
    for (let j = 0; j < columns; j++) {
      const gridCell = $(`#row-${i}-col-${j}`);
      gridCell.text('⚪');
      jsArr[i][j] = null;
    }
  }
}

const resetCount = (event) => {
  rWins = 0;
  yWins = 0;
  $('#yCount').text(yWins);
  $('#rCount').text(yWins);
};

jsArr = getBoard(rows, columns);
$('#resetBoard').click(resetBoard);
$('#resetCount').click(resetCount);