'use strict'

const statusDisplay = document.getElementById('status')
const countField = document.getElementById('numberTurns')
const startBox = document.getElementById('startBox')
const playField = document.getElementById('field')
const player1_name = document.getElementById('player1_name')
const player2_name = document.getElementById('player2_name')
const player1 = document.getElementById('player1')
const player2 = document.getElementById('player2')

let gameActive = true
let currentPlayer = 'X'
let gameState = []
let cols, rows, steps, counter = 0
let timer;
let button;
let timeLeft;
let label;

const winnMessage = () => `${currentPlayer.innerHTML} has won!`
const nobodyWinsMessage = () => `it's a draw!`

function countdown() {
    if (timeLeft) {
      label.innerHTML = timeLeft
      timeLeft--
      timer = setTimeout(countdown, 1000);
    } else {
      label.innerHTML = "<br/><br/>You Lost<br/><br/>Please Choose:<br/>'Play Again' or 'Restart'"
      timer = undefined
      gameActive = false
    }
  }
  
  function takeMove() {
    // timer is undefined if the game is not started
    if (typeof(timer) === "undefined") {
      timeLeft = 30;
      countdown();
    } else {
      clearTimeout(timer);
      timeLeft = 30;
      countdown();
    }
  }
  
  function init() {
    label = document.getElementById("label");
    button.addEventListener("click", takeMove);
  }
  
  document.addEventListener("DOMContentLoaded", init, false);


  // Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("instructions");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// ----------------------------------  BEGIN GAME ----------------------------------


let createMatrix = () => {
    let arr
    for (let i = 0; i < rows; i++) {
        arr = []
        for (let j = 0; j < cols; j++) {
            arr[j] = 0
        }
        gameState[i] = arr
    }
    console.log(gameState)
}
let drawField = () => {
    let cellSize = window.innerHeight * 0.5 / cols
    let box = document.createElement('div')
    box.setAttribute('id', 'container')

    let cell, row
    for (let i = 0; i < rows; i++) {
        row = document.createElement('div')
        row.className = 'row'
        for (let j = 0; j < cols; j++) {
            cell = document.createElement('div')
            cell.setAttribute('id', `${i}_${j}`)
            cell.className = 'cell'
            cell.style.width =
                cell.style.height =
                    cell.style.lineHeight = `${cellSize}px`
            cell.style.fontSize = `${cellSize / 16}em`
            row.appendChild(cell)
        }
        box.appendChild(row)
    }
    playField.appendChild(box)
}
player1.style.background = '#FF1493'
player2.style.background = '#FFC0CB'
let handleStart = () => {
    takeMove()
    player1.innerHTML = player1_name.value === '' ? 'Player \'X\'' : player1_name.value
    player2.innerHTML = player2_name.value === '' ? 'Player \'O\'' : player2_name.value
    cols = 3
    rows = 3
    steps = 3 
    createMatrix()
    drawField()
    startBox.className = 'hidden' // hide start box
    
    handlePlayerSwitch()
    document.querySelectorAll('.cell')
        .forEach(cell => cell.addEventListener('click', handleClick))
}

// ---------------------------------- WINNER ALGORITHM ----------------------------------

let isWinning = (y, x) => {
    let winner = currentPlayer === 'X' ? 1 : 2,
        length = steps * 2 - 1,
        rad = steps - 1,
        countWinnMoves, winnCoordinates

    // horizontal
    countWinnMoves = 0
    winnCoordinates = []
    for (let i = y, j = x - rad, k = 0; k < length; k++, j++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j]
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates)
                clearTimeout(timer);
                return
            }
        } else {
            countWinnMoves = 0
            winnCoordinates = []
        }
    }

    // vertical
    countWinnMoves = 0
    winnCoordinates = []
    for (let i = y - rad, j = x, k = 0; k < length; k++, i++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j]
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates)
                clearTimeout(timer);
                return
            }
        } else {
            countWinnMoves = 0
            winnCoordinates = []
        }
    }

    // oblique to the right
    countWinnMoves = 0
    winnCoordinates = []
    for (let i = y - rad, j = x - rad, k = 0; k < length; k++, i++, j++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j]
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates)
                clearTimeout(timer);
                return
            }
        } else {
            countWinnMoves = 0
            winnCoordinates = []
        }
    }

    // oblique to the left
    countWinnMoves = 0
    winnCoordinates = []
    for (let i = y - rad, j = x + rad, k = 0; k < length; k++, i++, j--) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j]
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates)
                clearTimeout(timer);
                return
            }
        } else {
            countWinnMoves = 0
            winnCoordinates = []
        }
    }
}

// ----------------------------------  GAME ONGOING

let handlePlayerSwitch = () => {
    if (currentPlayer === 'X') {
        player1.style.background = '#FF1493'
        player2.style.background = '#FFC0CB'
    } else {
        player1.style.background = '#FFC0CB'
        player2.style.background = '#FF1493'
    }
}

let isMovesLeft = () => {
    if (counter === cols * rows) {
        statusDisplay.innerHTML = nobodyWinsMessage()
        clearTimeout(timer)
        // stop timer
        gameActive = false
    }
}

let handleClick = (event) => {
    let clickedIndex = event.target.getAttribute('id').split('_');
    let i = +clickedIndex[0]
    let j = +clickedIndex[1]

    if (gameState[i][j] !== 0 || !gameActive)
        return

    gameState[i][j] = (currentPlayer === 'X') ? 1 : 2
    event.target.innerHTML = currentPlayer
    countField.innerHTML = `${++counter}`
    takeMove()
    isWinning(i, j)
    if (!gameActive) {
        return
    }
    else {
        isMovesLeft()
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
        handlePlayerSwitch()}
    

    // console.log(gameState)
}

// ----------------------------------  SHOW RESULTS ----------------------------------

function winnActions(winner) {
    console.log(winner)

    gameActive = false
    if (currentPlayer === 'X'){
        currentPlayer = player1
    }
    else currentPlayer = player2
    console.log(currentPlayer)
    statusDisplay.innerHTML = winnMessage()
    clearTimeout(timer)
    statusDisplay.style.color = '#006400'

    let cell
    for (let i = 0; i < winner.length; i++) {
        cell = document.getElementById(`${winner[i][0]}_${winner[i][1]}`)
        cell.style.color = '#7FFF00'
    }
}

// ----------------------------------  RESET GAME ----------------------------------
let handlePlayAgain = () => {
    gameActive = true
    currentPlayer = 'X'
    counter = 0
    countField.innerHTML = '0'
    statusDisplay.innerHTML = ''
    statusDisplay.style.color = 'black'
    player1.style.background = '#FF1493'
    player2.style.background = '#FFC0CB'
    playField.removeChild(document.getElementById('container'))
    handleStart()
}

let handleRestart = () => {
    clearTimeout(timer);
    timeLeft = "";
    label.innerHTML = timeLeft;
    gameActive = true
    currentPlayer = 'X'
    counter = 0
    countField.innerHTML = '0'
    statusDisplay.innerHTML = ''
    statusDisplay.style.color = 'black'
    player1.style.background = '#FF1493'
    player2.style.background = '#FFC0CB'
    player1_name.value = player2_name.value = ''
    player1.innerHTML = player2.innerHTML = '-'
    startBox.className = 'sidebar'
    playField.removeChild(document.getElementById('container'))
}



// ----------------------------------  BUTTON LISTENERS ----------------------------------

document.querySelector('#start').addEventListener('click', handleStart)
document.querySelector('#playAgain').addEventListener('click', handlePlayAgain)
document.querySelector('#restart').addEventListener('click', handleRestart)
document.querySelector( "#retrobg-sun" ).onclick = () => {
document.querySelector( "#retrobg" ).classList.toggle( "retrobg-shutdown" );
  };