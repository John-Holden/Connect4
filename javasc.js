const columns = 7;
const rows = 6;
const ytoken = '🟡';
const rtoken = '🔴';
const connectN = 4;
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
      break;
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
        const buttonClick = $(`#row-${i}-col-${colClicked}`);
        if (playerCount % 2 === 0) {
          buttonClick.text(ytoken);
        } else {
          buttonClick.text(rtoken);
        }
        jsArr[i][colClicked] = (playerCount % 2) + 1;
        winner = CheckWinner(i, colClicked, jsArr);

        // if win do something update score count and display win messgae
        playerCount++;
        if (winner) {
          const winMsg = $('<p> Winner! </p>');
          winMsg.attr('id', 'winMsg');
          winMsg.attr('class', 'winBanner');
          $('#grid').append(winMsg);
          $('#winMsg').fadeOut(2500);
        }
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
        column.attr('class', 'column');
        column.text('⚪');
        $(`#row-${i}`).append(column);
      }
    }
  }

  console.log('bord init done');
  console.log($('#row-0-column-0'));
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

jsArr = getBoard(rows, columns);
// let reset = document.getElementById("reset")
// reset.addEventListener("click", resetBoard)
$('#reset').click(resetBoard);
