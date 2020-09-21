const { gameStates } = require('../serverSide/gameLogic');
const gameLogic = require('../serverSide/gameLogic');
let config = gameLogic.gameStates

describe('Empty array creation', function() {
  const cols = 5
  const rows = 5
  let arr = gameLogic.emptyArr(rows, cols)
  it('Test row length', () => {
    expect(arr.length).toBe(rows + 1)
  })
  it('Test column length', () => {
    expect(arr[0].length).toBe(cols)
  })
  it('Test row and column values to be zero', () => {
    expect(arr.flat().every(val => val === 0)).toBe(true)
  })
})

test('Test empty array does not win', () => {
  const arr = gameLogic.emptyArr(config[1].rows, config[1].cols);
  const N = config[0].connectN
  expect(gameLogic.checkWins(arr, N)).toBe(false)
});

test('Test horizontal win', () => {
  const arr = gameLogic.emptyArr(config[1].rows, config[1].cols);
  const N = config[0].connectN
  arr[1].fill(1)
  expect(gameLogic.checkWins(arr, N)).toBe(true)
});

test('Test vertical win', () => {
  const arr = gameLogic.emptyArr(config[1].rows, config[1].cols);
  for (let i = 0; i < config[1].rows; i++) {
    arr[i][0] = 1
  }
  const N = config[0].connectN
  expect(gameLogic.checkWins(arr, N)).toBe(true)
});


describe('Diagonals logic', function() {
  let arr = gameLogic.emptyArr(config[1].rows, config[1].cols);
  it('Test +ve diagonal win ', () => {
    const diagLine = Math.max(config[1].rows, config[1].cols)
    for (let i = 0; i < diagLine; i++) {
      arr[i][i] = 1
    }
    const N = config[0].connectN
    expect(gameLogic.checkWins(arr, N)).toBe(true)
  })

  it('Test -ve diagonal win ', () => {
    let arr = gameLogic.emptyArr(config[1].rows, config[1].cols);
    for (let i = 0; i < config[1].rows; i++) {
      arr[config[1].rows - i][config[1].cols - i] = 2
    }
    const N = config[0].connectN
    expect(gameLogic.checkWins(arr, N)).toBe(true)
  })

  arr = gameLogic.emptyArr(config[1].rows, config[1].cols);
  it('Check diagonalise is in correct format:', () => {
    expect(Array.isArray(gameLogic.diagonalise(arr))).toBe(true)
  })
  it('Check for no undefined', () => {
    expect(gameLogic.diagonalise(arr).includes(undefined)).toBe(false)
  })
})


describe('Matrix operations', () => {
  // check arr content
  const arrEquality = (arr1, arr2) => {
    if (arr1.length === arr2.length &&
      arr1[0].length === arr2[0].length) {
      arr1 = arr1.flat()
      arr2 = arr2.flat()
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false
        }
      }
      return true
    } else { return false }
  }

  it(' Check array transpose equality ', () => {
    // set up transpose
    let arr = gameLogic.emptyArr(config[1].rows, config[1].cols);
    arr[1].fill(1)
    let arr1 = gameLogic.emptyArr(config[1].rows, config[1].cols);
    arr1[0][1] = 1
    arr1[1][1] = 1
    arr1[2][1] = 1
    arr1[3][1] = 1
    arr1[4][1] = 1
    arr1[5][1] = 1
    arr1[6][1] = 1
    const arrTransposed = gameLogic.transpose(arr1)
    expect(arrEquality(arrTransposed, arr)).toBe(true)
  })
})


describe('Fill board functionality', () => {

  it('first row, token 1, fill', () => {
    const actualOutput = gameLogic.fillBoard(config[1], 0, 1)
    const board = gameLogic.emptyArr(config[1].rows, config[1].cols)
    board[1][0] = 1
    expect(actualOutput.board).toStrictEqual(board)
  })

  it('last row, token 2, fill', () => {
    const inputBoard = gameLogic.emptyArr(config[1].rows, config[1].cols)
    for (let i = 1; i < config[1].rows; i++) { inputBoard[i].fill(1) }
    let newState = {...config[1] }
    newState.board = inputBoard
    const actualOutput = gameLogic.fillBoard(newState, 0, 2)
    const expectedBoard = gameLogic.emptyArr(config[1].rows, config[1].cols)
    for (let i = 1; i < config[1].rows; i++) { expectedBoard[i].fill(1) }
    expectedBoard[config[1].rows][0] = 2
    expect(actualOutput.board).toStrictEqual(expectedBoard)

  })
})