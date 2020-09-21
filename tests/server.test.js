const fs = require('fs');
const mock = require('mock-fs'); // mock files/directories
const Item = require('mock-fs/lib/item');
const request = require('supertest');
const app = require('../serverSide/server');
const gameStates = require('../serverSide/gameLogic').gameStates
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