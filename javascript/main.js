'use strict'

const MINE = '<img src="img/mine.png"/>'
const BLOWN_MINE = '<img src="img/blownMine.png"/>'
const FLAG = '🚩'
const NORMAL_EMOJI = '<img src="img/normalEmoji.png"onclick="reset()" />'
const LOSE_EMOJI = '<img src="img/loseEmoji.png" onclick="reset()"/>'
const WIN_EMOJI = '<img src="img/WinningEmoji.jpg" onclick="reset()"/>'//find diffrent
const SWEAT_EMOJI = '<img src="img/sweatingEmoji.jpg" onclick="reset()" />'
const HEART = '<img src="img/heart2.png" />'
var gPlayers = 0
sessionStorage.setItem('numOfPlayers', gPlayers)
var gLevel
var gGame
var gBoard
var gTimePassed
var startTime = 0

var gMines = []
var gFirstClick = 0
var gLives = 2
var gSafeClicks = 3

var gHeart
var gInterval
var gTimeOut
var gSafeClick
var gName

var gClicks = []
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
  gClicks = []
  gPlayers++
  clearInterval(gTimeOut)
  clearInterval(gInterval)
  gTimeOut = null
  gInterval = null
  gSafeClick = null
  gName = null
  gLives = 2
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
    for (var j = 0; j < gBoard[0].length; j++) {

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
    setTimeout(function () {
      // clickCounter()
      // insertTable()
    }, 5000)
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
      if (gFirstClick === 1) {// on first click put bombs and numbers to each cell
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
  // var pumpHeart = document.querySelector('video')
  if (gGame.isOn === false) return

  if (gBoard[i][j].isShown === true) return
  if (event.button === 0) {

    if (cell.innerText === FLAG) return
    if (gBoard[i][j].minesAroundCount === MINE && gLives == 0) {
      // pumpHeart.playbackRate = 0
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

      // pumpHeart.playbackRate += 1.5
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
    gBoard[i][j].innerText = (cell.innerText === FLAG) ? gBoard[i][j].innerText = FLAG : gBoard[i][j].innerText = ''
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
  if (gGame.isOn === false) return
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
    gTimeOut = setTimeout(() => {
      elCell.style.backgroundColor = 'gray'
      elCell.innerText = ''
    }, 1400);
    elCell.style.backgroundColor = 'orange'
    elCell.innerText = 'click here'
  }, 1000)
  gTimeOut = setTimeout(() => {
    clearInterval(gSafeClick)

  }, 6000);
}

function fullExpand() {

}
function clickCounter() {
  if (typeof (Storage) !== "undefined") {
    if (document.querySelector(".result").innerHTML) {
      alert('1')
      return
    }
    gName = prompt('What is your name?')
    document.querySelector(".result").innerHTML = gName
  }
}

function insertTable() {

  var table = document.querySelector(".winning-table tbody");
  console.log(table)
  if (table.rows.length > 10) {
    table.deleteRow(10);
  }

  var name = prompt('What is your name?')


  sessionStorage.setItem('name', name)
  sessionStorage.setItem('seconds', gGame.secsPassed)
  var row = table.insertRow(sessionStorage.getItem('numOfPlayers'));
  row.insertCell(0).innerHTML = sessionStorage.getItem('name') + ' \n' + sessionStorage.getItem('seconds') + ' seconds';
  console.log(sessionStorage.getItem('numOfPlayers'), sessionStorage.getItem('name'), sessionStorage.getItem('seconds'))

}

// function undo() {
//   if (gClicks.length <= 1) return
//   var showCount = document.querySelector('.showCount')
//   var markCount = document.querySelector('.markedCount')
//   var elCell = document.querySelector(`.cell${gClicks[gClicks.length - 1].i}-${gClicks[gClicks.length - 1].j}`)
//   gBoard[gClicks[gClicks.length - 1].i][gClicks[gClicks.length - 1].j].isShown = false;
//   console.log(elCell.innerText);
//   if (gBoard[gClicks[gClicks.length - 1].i][gClicks[gClicks.length - 1].j].innerText === FLAG) gGame.markedCount - 1
//   else gGame.shownCount - 1;
//   console.log(gGame.markedCount, gGame.shownCount)
//   markCount.innerText = 'marked Count: ' + gGame.markedCount
//   showCount.innerText = 'Show Count: ' + gGame.shownCount
//   elCell.innerText = '';
//   console.log(gBoard[gClicks[gClicks.length - 1].i][gClicks[gClicks.length - 1].j])
//   console.log(elCell)
//   elCell.style.backgroundColor = 'gray'
//   gClicks.pop()
// }
function undo() {

  console.log(gBoard)
  gClicks.push(JSON.parse(JSON.stringify(gBoard)))
  console.log(gClicks)
  // gBoard = gClicks.pop()
  // renderBoard(gBoard)
  // console.log(gBoard)
}