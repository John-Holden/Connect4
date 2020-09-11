/* eslint-disable eol-last */
/* eslint-disable no-console */
// migrate to an object to serverSide
const cols = 7;
const rows = 6;
let colX = 0;
let rowY = 0;
let rWins = 0;
let yWins = 0;
let playerCount = 0;
let inPlay = true;
let winnerStatus = false;

const mapState = (state) => ['⚪', '🟡', '🔴'][state];

const arrGet = (nRow, mCol) => {
  const arr = new Array(nRow + 1);
  for (let i = 0; i < nRow + 1; i++) {
    arr[i] = new Array(mCol);
    arr[i].fill(0);
  }
  return arr;
};

// display win messge
const winMsg = (winStatus, moveNum) => {
  if (winStatus) {
    if (moveNum % 2 === 0) {
      rWins++; // update red token counter
      $('#rCount').text(rWins);
      $('#winMsg').css('color', 'red');
    } else { // update yellow token counter
      yWins++;
      $('#yCount').text(yWins);
      $('#winMsg').css('color', 'yellow');
    }
    inPlay = false;
    $('#winMsg').fadeIn(200);
    $('#winMsg').fadeOut(2500);
  }
};

const boardClick = (event) => {
  const col = parseInt(event.target.id.split('-')[1], 10);
  const body = {
    colClicked: col,
  };
  $.ajax({
    type: 'POST',
    url: '/clicked',
    data: JSON.stringify(body),
    contentType: 'application/json',
    success: (result) => {
      // clear and re-render the
      gameState = result.gameStates.board;
      winnerStatus = result.gameStates.winnerStatus;
      playerCount = result.gameStates.playerCount;
      rowY = result.gameStates.rowY;
      colX = result.gameStates.colX;
      winMsg(winnerStatus, playerCount);
      $('#grid').empty();
      // eslint-disable-next-line no-use-before-define
      renderBoard();
    },
  });
};

const renderBoard = () => {
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
          button.click({ arr: gameState }, boardClick);
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
};

const resetBoard = () => {
  const body = {
    reset: true,
  };
  $.ajax({
    type: 'POST',
    url: '/resetBoard',
    data: JSON.stringify(body),
    contentType: 'application/json',
    success: (result) => {
      gameState = result.newBoard;
      inPlay = true;
      rowY = 0;
      colX = 0;
      $('#grid').empty();
      renderBoard();
    },
  });
};

const resetCounters = () => {
  const body = {
    reset: true,
  };
  $.ajax({
    type: 'POST',
    url: '/resetCounters',
    data: JSON.stringify(body),
    contentType: 'application/json',
    success: (result) => {
      if (result) {
        rWins = 0;
        yWins = 0;
      }
      $('#rCount').text(rWins);
      $('#yCount').text(yWins);
    },
  });
};

let gameState = arrGet(rows, cols); // migrate this to serverSide
$('#resetBoard').click(resetBoard);
$('#reset').click(resetCounters);
$(renderBoard());