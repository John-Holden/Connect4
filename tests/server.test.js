const fs = require('fs');
const mock = require('mock-fs'); // mock files/directories
const Item = require('mock-fs/lib/item');
const { config } = require('process');
const logic = require('../serverSide/gameLogic');
const request = require('supertest');
const { emptyArr, gameStates, fillBoard } = require('../serverSide/gameLogic');
const app = require('../serverSide/server');
require('iconv-lite').encodingExists('foo');

describe('GET /init', () => {
  it('test for empty baord', done => {
    request(app)
      .get('/init')
      .expect('Content-Type', /json/)
      .expect(200, JSON.stringify(gameStates[1])) // error code 200: pass
      .end(done)
  })
})

describe('POST /resetCounters', () => {
  it('test counters reset', done => {
    request(app)
      .post('/resetCounters')
      .send({ reset: true }) // if true, return zero counts
      .expect(200)
      .expect({ rWins: 0, yWins: 0 })
      .end(done)
  })
  it('test counters reset', done => {
    request(app)
      .post('/resetCounters')
      .send({ reset: false }) // if false, raise error
      .expect(500)
      .end(done)
  })
})

describe('POST /resetBoard', () => {
  it('test board is correctly reset', done => {
    const resetState = {...gameStates[1] }
    delete resetState.colAnim
    delete resetState.rowAnim
    request(app)
      .post('/resetBoard')
      .send({ reset: true })
      .expect(200, resetState) // return state with empty board
      .end(done)
  })

  it('test board is not correctly reset', done => {
    request(app)
      .post('/resetBoard')
      .send({ reset: false })
      .expect(500) // return state with empty board
      .end(done)
  })
})

describe('POST /resetBoard', () => {
  it('test board is correctly reset', done => {
    const resetState = {...gameStates[1] }
    delete resetState.colAnim
    delete resetState.rowAnim
    request(app)
      .post('/resetBoard')
      .send({ reset: true })
      .expect(200, resetState) // return state with empty board
      .end(done)
  })

  it('test board is not correctly reset', done => {
    request(app)
      .post('/resetBoard')
      .send({ reset: false })
      .expect(500) // return state with empty board
      .end(done)
  })
})

describe('POST /board clicked', () => {
    const boardScenario = emptyArr(6, 7)
    boardScenario[1][2] = 2
    const expectedOutput = [
      { rWins: 0, yWins: 0, winner: false },
      {...gameStates[1] }
    ]
    expectedOutput[1].colAnim = 2
    expectedOutput[1].rowAnim = 1
    expectedOutput[1].playerCount = 1 // increment player count
    expectedOutput[1].board = boardScenario
    expectedOutput[1].board[1][2] = 2 // first turn 
    it('Place token, update player count', done => {
      request(app)
        .post('/clicked')
        .send({ colClicked: 2 })
        .expect(200, expectedOutput)
        .end(done)
    })
  })
  // jest.spyOn(logic, 'fillBoard').mockReturnValue(expectedOutput)
  // it('Detect win and send correct state', done => {
  //   request(app)
  //     .post('/clicked')
  //     .send({ colClicked: 2 })
  //     .expect(200, expectedOutput)
  //     .end(done)
  // })