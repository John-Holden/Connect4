/* eslint-disable eol-last */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
const express = require('express');
let { gameState } = require('./gameLogic');
const { emptyArr, checkWins, fillBoard } = require('./gameLogic');

const app = express();
app.use(express.static('./clientSide'));
app.use(express.json());

app.post('/clicked', (req, res) => {
  // update board
  gameState = fillBoard(gameState, req.body.colClicked);
  gameState.playerCount++;
  gameState.winner = checkWins(gameState.board, gameState.connectN);
  if (gameState.winner) {
    if (gameState.playerCount % 2 === 0) {
      gameState.rWins++;
    } else { gameState.yWins++; }
    gameState.inPlay = false;
  }
  res.json(gameState);
});

app.post('/resetBoard', (req, res) => {
  if (req.body.reset) {
    // reset board and resume game
    gameState.board = emptyArr(gameState.rows, gameState.cols);
    gameState.inPlay = true;
    gameState.colAnim = undefined;
    gameState.rowAnim = undefined;
    res.json(gameState);
  }
});

app.post('/resetCounters', (req, res) => {
  // empty counters & reset scoreboard
  if (req.body.reset) {
    res.json({
      rWins: 0,
      yWins: 0,
    });
  }
});

app.get('/init', (req, res) => {
  // send intial game state
  res.json(gameState);
});

app.listen(3000);