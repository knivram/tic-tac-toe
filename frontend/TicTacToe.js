let gameFeld = [
    ['','',''],
    ['','',''],
    ['','','']
]

function clearGameField(){
    gameFeld = [
        ['','',''],
        ['','',''],
        ['','','']
    ]
}

const player = new Player()

async function setBot(){
    if (player.isPlayingWithBot){
        if (player.draw || player.winner) return
        if (player.currentPlayer === player.player2){
            const [i, j] = await bestMove()
            gameFeld[i][j] = player.currentPlayer.value
            player.toggle()
            drawGame()
            checkWinner()
        }
    }
}
setBot()
drawGame()

function drawGame(){
    markCurrentPlayer()
    for (let i = 0; i < gameFeld.length; i++) {
        for (let j = 0; j < gameFeld[i].length; j++) {
            document.getElementById(i+''+j).innerHTML = gameFeld[i][j]
        }
    }
}

function drawGameEnd(){
    document.getElementById('winsPlayer1').innerText = player.player1.wins
    document.getElementById('winsPlayer2').innerText = player.player2.wins
    document.getElementById('draws').innerText = (player.numberOfGames - player.player1.wins - player.player2.wins)
    document.getElementById('gameInfo').style.display = 'flex'
    document.getElementById('gameInfo').style.setProperty('--color', 'rgba(14, 54, 14, 1)')
    document.getElementById('gameInfo').style.setProperty('--background-color', 'rgba(76, 159, 76, 0.9)')
    if (player.winner === player.player1){
        document.getElementById(player.player2.id).style.color = 'var(--inActiv)'
        document.getElementById(player.player2.winsId).style.color = 'var(--inActiv)'
        document.getElementById(player.player1.id).classList.add('winAnimation')
        document.getElementById('winsPlayer1').classList.add('winAnimation')
        document.getElementById('gameInfoText').innerText = `Spieler (${player.player1.value}) hat gewonnen.`
    } else if (player.winner === player.player2){
        document.getElementById(player.player1.id).style.color = 'var(--inActiv)'
        document.getElementById(player.player1.winsId).style.color = 'var(--inActiv)'
        document.getElementById(player.player2.id).classList.add('winAnimation')
        document.getElementById('winsPlayer2').classList.add('winAnimation')
        document.getElementById('gameInfoText').innerText = `Spieler (${player.player2.value}) hat gewonnen.`
    } else if (player.draw){
        document.getElementById('gameInfo').style.setProperty('--color', 'rgb(110,84,29)')
        document.getElementById('gameInfo').style.setProperty('--background-color', 'rgba(203,157,40,0.9)')
        document.getElementById('gameInfoText').innerText = 'Unentschieden!'
        document.getElementById(player.player2.id).style.color = 'var(--inActiv)'
        document.getElementById(player.player2.winsId).style.color = 'var(--inActiv)'
        document.getElementById(player.player1.id).style.color = 'var(--inActiv)'
        document.getElementById(player.player1.winsId).style.color = 'var(--inActiv)'
        document.getElementById('draws').classList.add('winAnimation')
    }
}

function markCurrentPlayer(){
    document.getElementById(player.player1.id).style.color = 'var(--inActiv)'
    document.getElementById(player.player1.winsId).style.color = 'var(--inActiv)'
    document.getElementById(player.player2.id).style.color = 'var(--inActiv)'
    document.getElementById(player.player2.winsId).style.color = 'var(--inActiv)'
    document.getElementById(player.currentPlayer.id).style.color = 'white'
    document.getElementById(player.currentPlayer.winsId).style.color = 'white'
}

function clearWinAnimation(){
    document.getElementById(player.player1.id).classList.remove('winAnimation')
    document.getElementById(player.player2.id).classList.remove('winAnimation')
    document.getElementById('winsPlayer1').classList.remove('winAnimation')
    document.getElementById('winsPlayer2').classList.remove('winAnimation')
    document.getElementById('draws').classList.remove('winAnimation')
}

function clearWinScreen(){
    clearWinAnimation()
    document.getElementById('gameInfo').style.display = 'none'
}

function resetGame(){
    player.nextPlyer()
    player.winner = null
    player.draw = null
    clearGameField()
    clearWinScreen()
    drawGame()
    setBot()
}


function clickHandler(id){
    if (player.winner || player.draw){
        resetGame()
        return
    }
    const i = id.charAt(0)
    const j = id.charAt(1)
    if (gameFeld[i][j] === '' && !player.winner && !player.draw && !(player.isPlayingWithBot && player.currentPlayer === player.player2)){
        gameFeld[i][j] = player.currentPlayer.value
        player.toggle()
        drawGame()
        checkWinner()
    }
    setBot()
}

function checkWinner(){
    const result = checkGameFeld()
    if (result === null) return
    if (result === player.player1.value){
        player.winner = player.player1
        player.player1.wins ++
    } else if (result === player.player2.value){
        player.winner = player.player2
        player.player2.wins ++
    } else {
        player.draw = true
    }
    player.numberOfGames ++
    drawGameEnd()
}

function checkGameFeld() {
    // Überprüfen auf horizontale Gewinnmöglichkeiten
    for (let row = 0; row < 3; row++) {
        if (gameFeld[row][0] !== '' && gameFeld[row][0] === gameFeld[row][1] && gameFeld[row][1] === gameFeld[row][2]) {
            return gameFeld[row][0];
        }
    }

    // Überprüfen auf vertikale Gewinnmöglichkeiten
    for (let col = 0; col < 3; col++) {
        if (gameFeld[0][col] !== '' && gameFeld[0][col] === gameFeld[1][col] && gameFeld[1][col] === gameFeld[2][col]) {
            return gameFeld[0][col];
        }
    }

    // Überprüfen auf diagonale Gewinnmöglichkeiten
    if (gameFeld[0][0] !== '' && gameFeld[0][0] === gameFeld[1][1] && gameFeld[1][1] === gameFeld[2][2]) {
        return gameFeld[0][0];
    }
    if (gameFeld[0][2] !== '' && gameFeld[0][2] === gameFeld[1][1] && gameFeld[1][1] === gameFeld[2][0]) {
        return gameFeld[0][2];
    }

    return checkDraw()
}

function checkDraw(){
    let hasEmpty = []
    gameFeld.forEach(item => {if (!item.includes('')) hasEmpty.push(true)})
    if (hasEmpty.length === 3) return 'draw'
    else return null
}


