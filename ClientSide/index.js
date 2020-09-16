/* eslint-disable no-use-before-define */
/* eslint-disable eol-last */
/* eslint-disable no-console */
// migrate to an object to serverSide

const mapState = (state) => ['⚪', '🟡', '🔴'][state];

// display win messge pop up
const winMsg = (moveNum, rWins, yWins) => {
  if (moveNum % 2 === 0) {
    $('#rCount').text(rWins);
    $('#winMsg').css('color', 'red');
  } else {
    $('#yCount').text(yWins);
    $('#winMsg').css('color', 'yellow');
  }
  $('#winMsg').fadeIn(200);
  $('#winMsg').fadeOut(2500);
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
      const game = result;
      if (game.winner) {
        winMsg(game.playerCount, game.rWins, game.yWins);
      }
      // clear and re-render the board.
      $('#grid').empty();
      renderBoard(game);
    },
  });
};

const renderBoard = (game) => {
  const grid = $('#grid');
  for (let i = 0; i < game.rows + 1; i++) {
    const row = $('<div> </div>');
    row.attr('id', `row-${i}`);
    row.attr('class', 'row row-md-12');
    grid.prepend(row);
    for (let j = 0; j < game.cols; j++) {
      if (i === 0) { // assign buttons to register take turn.
        const button = $('<button> </button>');
        button.attr('id', `button-${j}`);
        button.attr('class', 'btn btn-primary btn-lg counterButtons column');
        button.text('🖖');
        if (game.inPlay) {
          button.click({ arr: game.board }, boardClick);
        }
        $(`#row-${i}`).append(button);
      } else {
        const column = $('<div> </div>');
        column.attr('id', `row-${i}-col-${j}`);
        if (game.playerCount > 0 && j === game.colAnim && i === game.rowAnim && game.board[i][j]) {
          // If clicked, apply animation
          const text = $('<div></div>');
          text.attr('class', 'movetxt');
          text.text(mapState(game.board[i][j]));
          column.attr('class', 'column cell');
          column.text('⚪');
          column.append(text);
        } else {
          column.attr('class', 'columm');
          // column.text(mapState(game.board[i][j]));
          column.text(['⚪', '🟡', '🔴'][game.board[i][j]]);
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
      const game = result;
      $('#grid').empty();
      renderBoard(game);
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
        $('#rCount').text(result.rWins);
        $('#yCount').text(result.yWins);
      }
    },
  });
};

const startGame = () => {
  $.ajax({
    type: 'GET',
    url: '/init',
    success: (result) => {
      console.log('received...');
      const game = result;
      $('#resetBoard').click(resetBoard);
      $('#reset').click(resetCounters);
      $(renderBoard(game));
    },
  });
};

startGame();