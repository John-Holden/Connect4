/* eslint-disable eol-last */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
const express = require('express');
const {
  gameStates,
  emptyArr,
  checkWins,
  fillBoard,
} = require('./gameLogic');

const app = express();
app.use(express.static('./clientSide'));
app.use(express.json());

app.post('/clicked', (req, res) => { // update board
  gameStates[1].playerCount++;
  const player = (gameStates[1].playerCount % 2) + 1;
  const { colClicked } = req.body;
  gameStates[1] = fillBoard(gameStates[1], colClicked, player);
  gameStates[0].winner = checkWins(gameStates[1].board, gameStates[0].connectN);

  if (gameStates[0].winner) { // update win counts
    if (player === 1) {
      gameStates[0].yWins++;
    } else {
      gameStates[0].rWins++;
    }
    gameStates[1].inPlay = false;
  }
  res.json([{
    rWins: gameStates[0].rWins,
    yWins: gameStates[0].yWins,
    winner: gameStates[0].winner,
  }, gameStates[1]]);
});

app.post('/resetBoard', (req, res) => {
  if (req.body.reset) { // reset board and resume game
    gameStates[1].board = emptyArr(gameStates[1].rows, gameStates[1].cols);
    gameStates[1].inPlay = true;
    delete gameStates[1].colAnim
    delete gameStates[1].rowAnim
    res.json({...gameStates[1] });
  } else {
    throw new Error('reset not granted')
  }
});

app.post('/resetCounters', (req, res) => { // empty counters & reset scoreboard
  if (req.body.reset) {
    gameStates[0].rWins = 0;
    gameStates[0].yWins = 0;
    res.json({
      rWins: gameStates[0].rWins,
      yWins: gameStates[0].yWins,
    });
  } else {
    throw new Error('Reset not granted')
  }
});

app.get('/startGame', (req, res) => { // start the game game send data
  res.json(gameStates[1]);
});

app.post('/gameSetup', (req, res) => { // update state object
  let winConfig = req.body.winConfig
  let rows = req.body.rowConfig
  let cols = req.body.colConfig
  if (rows === '' || cols === '' || winConfig === '') {
    rows = 6
    cols = 7
    winConfig = 4
  } else {
    rows = parseInt(rows, 10)
    cols = parseInt(cols, 10)
    winConfig = parseInt(winConfig, 10)
  }
  gameStates[1].rows = rows
  gameStates[1].cols = cols
  gameStates[0].connectN = winConfig
  gameStates[1].board = emptyArr(rows, cols)
  res.json('')
})

app.post('/userInit', (req, res) => {
  res.json('randomlyGeneratedId...');
})

if (process.env.NODE_ENV !== 'test') { // set listen for test
  app.listen(3000, () => {
    console.log('server started on port 3000');
  });
}

if (typeof module !== 'undefined') {
  module.exports = app
}