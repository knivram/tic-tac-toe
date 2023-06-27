function fieldIsEmpty(){
    let fieldIsEmpty = true
    for (let i = 0; i < gameFeld.length; i++) {
        for (let j = 0; j < gameFeld.length; j++) {
            if (gameFeld[i][j] !== '') fieldIsEmpty = false
        }
    }
    return fieldIsEmpty
}

async function bestMove() {
    const corners = [[0,0], [0,2], [2,0], [2,2]]
    if (fieldIsEmpty()){
        return corners[Math.floor(Math.random() * corners.length)]
    }

    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // Is the spot available?
            if (gameFeld[i][j] === '') {
                gameFeld[i][j] = player.player2.value;
                let score = minimax(gameFeld, 0, false);
                gameFeld[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = [i, j];
                }
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 700));
    return move
}

const scores = {
    X: -1,
    O: 1,
    draw: 0
};

function minimax(board, depth, isMaximizing) {
    let result = checkGameFeld();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Is the spot available?
                if (board[i][j] === '') {
                    board[i][j] = player.player2.value;
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Is the spot available?
                if (board[i][j] === '') {
                    board[i][j] = player.player1.value;
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}