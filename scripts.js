function gameBoard() {
    const gameArr = [null, null, null,
                   null, null, null,
                   null, null, null];
    let numFilled = 0;
    
    const getValue = function(pos) {
        return gameArr[pos];
    }

    const setValue = function(pos, val) {
        gameArr[pos] = val;
        numFilled++;
    }

    const isDone = function(move) {
        if (numFilled===9) {
            return true
        }
        const marker = getValue(move);
        const i = Math.floor(move / 3);
        const j = move % 3;
        const wonCol = gameArr[((i+1)*3+j)%9] == marker && gameArr[((i+2)*3+j)%9] == marker;
        const wonRow = gameArr[i*3+(j+1)%3] == marker && gameArr[i*3+(j+2)%3] == marker;
        let wonDiagonal = false;
        if (move%2==0) {
            wonDiagonal = gameArr[0] == marker && gameArr[4] == marker && gameArr[8] == marker;
            wonDiagonal = wonDiagonal || (gameArr[2] == marker && gameArr[4] == marker && gameArr[6] == marker);
        }
        return wonCol || wonRow || wonDiagonal
    }

    const resetBoard = function() {
        for (let i = 0; i<9; i++) {
            gameArr[i]=null;
        }
        numFilled = 0;
    }

    return {gameArr, getValue, setValue, isDone, resetBoard};
}

function player(name, marker) {
    let wins = 0;

    const incrementWins = ()=>{wins++}

    const getWins = ()=>{return wins}

    return {name, marker, incrementWins, getWins}
}

function playGame(player1, player2) {
    const game = gameBoard();

    const isValid = function(move) {
        return !(game.getValue(move))
    }

    const updateBoard = function(player, move) {
        game.setValue(move, player.marker);
    }

    const isDone = function(move) {
        return game.isDone(move)
    }

    const printBoard = function() {
        return game.gameArr
    }

    const resetBoard = function() {
        return game.resetBoard()
    }

    return {updateBoard, isValid, isDone, printBoard, resetBoard};
}

function main() {
    const name1 = prompt("Player 1 name? ");
    const player1 = player(name1, "x");

    const name2 = prompt("Player 2 name? ");
    const player2 = player(name2, "o");

    const game = playGame(player1, player2);
    let isGoing = true;
    let current_player = player1;

    while (isGoing) {
        const next_move = prompt(`${current_player.name}'s turn to move`);
        if (!game.isValid(next_move)) {
            console.log("invalid move");
            continue;
        }

        game.updateBoard(current_player, next_move);
        if (game.isDone(next_move)) {
            current_player.incrementWins();
            console.log(`${current_player.name} is the winner!`);
            const p1_wins = player1.getWins();
            const p2_wins = player2.getWins();
            console.log(`Current record is ${player1.name}:${p1_wins} - ${player2.name}:${p2_wins}`);

            const playAgain = prompt("Play again? Type y");
            if (playAgain!="y") {
                isGoing = false
            } else {
                game.resetBoard();
            }
        }

        current_player = current_player==player1 ? player2 : player1;
    }
    console.log("good game!");
}