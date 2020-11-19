'use strict'

const MINE = '<img src="img/mine.png"/>'
const BLOWN_MINE = '<img src="img/blownMine.png"/>'
const FLAG = '🚩'
const NORMAL_EMOJI = '<img src="img/normalEmoji.png"onclick="reset()" />'
const LOSE_EMOJI = '<img src="img/loseEmoji.png" onclick="reset()"/>'
const WIN_EMOJI = '<img src="img/WinningEmoji.jpg" onclick="reset()"/>'//find diffrent
const SWEAT_EMOJI = '<img src="img/sweatingEmoji.jpg" onclick="reset()" />'
const HEART = '<img src="img/heart.jpg" />'
var gLevel
var gGame
var gBoard
var gTimePassed
var startTime = 0
var gMines = []
var gFirstClick = 0
var gLives = 3
var gSafeClicks = 3
var gHeart
var gInterval
var gTimeOut
var gSafeClick
var gLevel = {
  SIZE: 4,
  MINES: 2
};
var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0
}

function init() {
  var gHeart = document.querySelector('.lives')
  gHeart.innerHTML = null
  gHeart.style.visibility = 'visible'
  gHeart.innerHTML += HEART
  gHeart.innerHTML += HEART
  gHeart.innerHTML += HEART
  var emoji = document.querySelector('.emoji')
  emoji.innerHTML = NORMAL_EMOJI
  gBoard = buildBoard()
  renderBoard(gBoard)
  // getGrayCells()
  var safe = document.querySelector('.safeClick')
  safe.innerText = ' safe Clicks left: ' + gSafeClicks
  var showCount = document.querySelector('.showCount')
  var markCount = document.querySelector('.markedCount')
  var secPass = document.querySelector('.secondsPassed')
  markCount.innerText = 'marked Count: ' + gGame.markedCount
  showCount.innerText = 'Show Count: ' + gGame.shownCount
  secPass.innerText = 'Seconds Passed: ' + gGame.secsPassed

}
function reset() {
  clearInterval(gTimeOut)
  clearInterval(gInterval)
  gTimeOut = null
  gInterval = null
  gSafeClick = null
  gLives = 3
  gSafeClicks = 3
  startTime = 0
  gFirstClick = 0
  clearInterval(gTimePassed)
  gGame.isOn = true
  gTimePassed
  gGame.shownCount = 0
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gMines = []
  init()
}
function buildBoard() {
  var board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = {
        i: i,
        j: j,
        isShown: false,
        minesAroundCount: null
      }
      board[i][j] = cell
    }
  }
  // randomMines(board)
  // setMinesNegsCount(board)
  return board
}
function renderBoard(gBoard) {

  var strHtml = '';
  for (var i = 0; i < gBoard.length; i++) {//span is so that the table wont move/collapse
    strHtml += '<tr>'
    for (var j = 0; j < gBoard[0].length; j++) {//onclick="cellClicked(this,${i},${j})"
      // var className = (gBoard[i][j]) ? 'occupied' : '';
      strHtml += `<td data-i="${i}" data-j="${j}" onmouseup="cellClicked(event,this,${i},${j})"
          class=" cells cell${i}-${j}"></td>`//${gBoard[i][j].minesAroundCount}
    }
    strHtml += '</tr>'
  }

  var elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHtml

}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {

      board[i][j].minesAroundCount = checkMines(board, board[i][j])
    }
  }
}

function checkMines(board, cell) {
  var count = null
  //console.log(cell);
  if (cell.minesAroundCount === MINE) return MINE
  for (var i = cell.i - 1; i <= cell.i + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (var j = cell.j - 1; j <= cell.j + 1; j++) {
      if (j < 0 || j > board.length - 1) continue
      if (i === cell.i && j === cell.j) continue
      if (board.isShown !== true)
        if (board[i][j].minesAroundCount === MINE) count++
    }
  }
  return count
}
function lostGame() {
  for (var i = 0; i < gMines.length; i++) {
    var cell = gMines[i]
    var elCell = document.querySelector(`.cell${cell.i}-${cell.j}`);
    elCell.innerHTML = MINE;
  }
  var emoji = document.querySelector('.emoji')
  emoji.innerHTML = LOSE_EMOJI
  clearInterval(gTimePassed)
  gGame.isOn = false
  console.log('lost')
  gInterval = setInterval(function () {
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard.length; j++) {
        var cell = document.querySelector(`.cell${i}-${j}`)
        cell.style.backgroundColor = 'gray'
        cell.style.transition = `${(gBoard.length - i) / 7}s`
        cell.innerText = ''
      }
    }
    gTimeOut = setTimeout(function () {
      for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
          var cell = document.querySelector(`.cell${i}-${j}`)
          cell.style.backgroundColor = 'red'
          cell.style.transition = `${gBoard.length - i}s`
        }
      }
    }, 500);
  }, 3000)
  //alert('THIS GAME TEST YOUR IQ\nYOURS IS: NaN')
}
function checkGameOver() {
  if (gLevel.SIZE ** 2 - gLevel.MINES === gGame.shownCount && gGame.markedCount === gLevel.MINES) {
    console.log('you win')
    gGame.isOn = false
    var emoji = document.querySelector('.emoji')
    emoji.innerHTML = WIN_EMOJI
    clearInterval(gTimePassed)

    gInterval = setInterval(function () {
      for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
          var cell = document.querySelector(`.cell${i}-${j}`)
          cell.style.backgroundColor = 'gray'
          cell.style.transition = `${(gBoard.length - i) / 7}s`
          cell.innerText = ''
        }
      }
      gTimeOut = setTimeout(function () {
        for (var i = 0; i < gBoard.length; i++) {
          for (var j = 0; j < gBoard.length; j++) {
            var cell = document.querySelector(`.cell${i}-${j}`)
            cell.style.backgroundColor = 'green'
            cell.style.transition = `${gBoard.length - i}s`
          }
        }
      }, 500);
    }, 3000)
  }

}

function openNeibours(cellI, cellJ) {
  // console.log(cellI, cellJ, cell)
  var shown = document.querySelector('.showCount')
  //console.log(gBoard);
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= gBoard.length) continue;

      gFirstClick++
      if (gFirstClick === 1) {
        randomMines(gBoard)
        setMinesNegsCount(gBoard)
      }
      if (gBoard[i][j].minesAroundCount !== MINE && gBoard[i][j].isShown !== true) {
        // update the model:
        // if (gBoard[i][j].isShown !== true) {
        var elCell = document.querySelector(`.cell${i}-${j}`)
        gGame.shownCount++
        shown.innerText = 'Show Count: ' + gGame.shownCount
        gBoard[i][j].isShown = true
        renderCell({ i: i, j: j }, gBoard[i][j].minesAroundCount)
        elCell.classList.add('shown')
        //  }
      }

    }
  }
}

function renderCell(location, value) {
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);

  elCell.innerText = value;
}

function cellClicked(event, cell, i, j) {
  startTime++
  clearInterval(gTimeOut)
  clearInterval(gSafeClick)
  var shown = document.querySelector('.showCount')
  if (gGame.isOn === false) return
  if (gBoard[i][j].isShown === true) return
  if (event.button === 0) {

    if (cell.innerText === FLAG) return

    if (gBoard[i][j].minesAroundCount === MINE && gLives == 0) {
      lostGame(i, j)
      gBoard[i][j].isShown = true
      cell.innerHTML = BLOWN_MINE
      cell.style.backgroundColor = 'red'
      gBoard[i][j].innerText = cell.innerText
      cell.classList.add('lost')
      return
    }
    else if (gLives !== 0 && gBoard[i][j].minesAroundCount === MINE) {
      gLives--
      var gHeart = document.querySelector('.lives')
      gHeart.innerHTML = null
      for (var i = 0; i <= gLives - 1; i++) {

        gHeart.innerHTML += HEART
      }
      if (gLives === 0) {
        gHeart.innerHTML += HEART
        gHeart.style.visibility = 'hidden'
      }
      cell.style.backgroundColor = 'red'
      setTimeout(() => {
        cell.style.backgroundColor = 'gray'
        cell.style.transition = '2s'
      }, 700);
      return
    }
    gBoard[i][j].isShown = true
    gGame.shownCount++
    shown.innerText = 'Show Count: ' + gGame.shownCount

    cell.style.backgroundColor = 'azure'

    if (gBoard[i][j].minesAroundCount === null) {

      openNeibours(gBoard[i][j].i, gBoard[i][j].j)
    }

    cell.innerText = gBoard[i][j].minesAroundCount
    gBoard[i][j].innerText = cell.innerText

  }
  if (event.button === 2) {

    cellMarked(cell)
    //console.log(cell)
    gBoard[i][j].innerText = (cell.innerText === FLAG) ? gBoard[i][j].innerText = FLAG : gBoard[i][j].innerText = ''
    // console.log(gBoard[i][j].innerText)
  }
  if (startTime === 1) {

    var secPass = document.querySelector('.secondsPassed')
    gTimePassed = setInterval(() => {
      gGame.secsPassed++
      secPass.innerText = 'Seconds Passed: ' + gGame.secsPassed
    }, 1000);
  }
  checkGameOver()
}

function cellMarked(cell) {
  var markCount = document.querySelector('.markedCount')

  cell.innerText = (cell.innerText === FLAG) ? cell.innerText = '' : cell.innerText = FLAG
  gGame.markedCount = (cell.innerText === FLAG) ? gGame.markedCount + 1 : gGame.markedCount - 1
  markCount.innerText = 'marked Count: ' + gGame.markedCount
}

function randomMines(board) {
  var counter = 0
  var randomNum = 0
  while (counter !== gLevel.MINES) {
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board.length; j++) {
        if (counter === gLevel.MINES) break
        randomNum = getRandomInt(1, 1000)
        //check after first click wont add a mine to a shown spot
        if (randomNum < 3 && board[i][j].minesAroundCount !== MINE && board[i][j].isShown !== true) {
          gMines.push({ i, j })
          board[i][j].minesAroundCount = MINE
          counter++;
        }
      }
    }
  }
  console.log(gMines);
}

function safeClick() {
  if (gSafeClicks === 0) return
  gSafeClicks--;
  var elSafe = document.querySelector('.safeClick')
  elSafe.innerText = 'safe Clicks left: ' + gSafeClicks
  var safes = []

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isShown || gBoard[i][j].minesAroundCount === MINE) continue
      safes.push({ i, j })
    }
  }
  if (safes.length === 0) return

  var randomPlace = safes.splice(getRandomInt(0, safes.length - 1), 1)[0]

  var elCell = document.querySelector(`.cell${randomPlace.i}-${randomPlace.j}`)

  gSafeClick = setInterval(function () {
    setTimeout(() => {
      elCell.style.backgroundColor = 'gray'
    }, 1400);
    elCell.style.backgroundColor = 'orange'
  }, 1000)
  gTimeOut = setTimeout(() => {
    clearInterval(gSafeClick)
    //elCell.style.backgroundColor = 'gray'
  }, 8000);
}