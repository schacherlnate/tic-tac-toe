const gameBoard = (() => {
    const gameArr = [null, null, null,
                   null, null, null,
                   null, null, null];
    let numFilled = 0;
    
    const getValue = function(pos) {
        return gameArr[pos];
    }

    const setValue = function(pos, val) {
        if (gameArr[pos]) {
            return false
        }

        gameArr[pos] = val;
        numFilled++;
        return true
    };

    const resetBoard = function() {
        for (let i = 0; i<9; i++) {
            gameArr[i]=null;
        }
        numFilled = 0;
    }

    return {gameArr, getValue, setValue, resetBoard, numFilled};
})();

function player(name, marker) {
    let wins = 0;

    const incrementWins = ()=>{wins++}

    const getWins = ()=>{return wins}

    return {name, marker, incrementWins, getWins}
}

const gameController = (() => {
    let player1, player2, isDone, current_player = false;

    const startGame = function(name1, name2) {
        player1 = player(name1 || "player1", "x");
        player2 = player(name2 || "player 2", "o");
        current_player = player1;
        isDone = false;
        gameBoard.resetBoard();
        gameDisplay.makeCells();
    }

    const playTurn = function(index) {
        if (isDone || !gameBoard.setValue(index, current_player.marker)) return

        gameDisplay.updateCell(index, current_player.marker);

        if (gameController.checkTie()) {
            isDone = true
        }

        if (gameController.checkWinner()) {
            isDone = true
        }
    }

    const checkTie = function() {
        return gameBoard.numFilled == 9
    }

    const checkWinner = function(move) {
        const marker = gameBoard.getValue(move);
        const i = Math.floor(move / 3);
        const j = move % 3;
        const wonCol = gameBoard.gameArr[((i+1)*3+j)%9] == marker && gameBoard.gameArr[((i+2)*3+j)%9] == marker;
        const wonRow = gameBoard.gameArr[i*3+(j+1)%3] == marker && gameBoard.gameArr[i*3+(j+2)%3] == marker;
        let wonDiagonal = false;
        if (move%2==0) {
            wonDiagonal = gameBoard.gameArr[0] == marker && gameBoard.gameArr[4] == marker && gameBoard.gameArr[8] == marker;
            wonDiagonal = wonDiagonal || (gameBoard.gameArr[2] == marker && gameBoard.gameArr[4] == marker && gameBoard.gameArr[6] == marker);
        }
        return wonCol || wonRow || wonDiagonal
    }

    const resetBoard = function() {
        return game.resetBoard()
    }

    return {startGame, checkTie, checkWinner, updateBoard, isValid, isDone, printBoard, resetBoard, playTurn};
})();

const gameDisplay = (() => {
    const gameWrapper = document.querySelector(".gameWrapper");
    const makeCells = function() {
        gameBoard.gameArr.forEach((pos)=>{
            const newCell = document.createElement("div");
            newCell.textContent = "";
            newCell.addEventListener("click", ()=>{
                gameController.playTurn(pos);
            });
            gameWrapper.appendChild(newCell);
        })
    }

    const updateCell = function(index, marker) {
        const cell = gameWrapper.children[index];
        cell.textContent = marker;
    }

    return {makeCells, updateCell}
})();

function main() {

    const output = document.querySelector("#output");
    const record = document.querySelector("#record");
    const p1_name = document.querySelector("#p1").value;
    const p2_name = document.querySelector("#p2").value;

    output.textContent = "Name for player1?"
    const name1 = p1_name || "Player 1";
    const player1 = player(name1, "x");

    output.textContent = "Name for player2?"
    const name2 = p2_name || "Player 2";
    const player2 = player(name2, "o");

    output.textContent = "Good luck!";

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
            record.textContent = `${p1_wins}: ${p2_wins}`;
            console.log(`Current record is ${player1.name}:${p1_wins} - ${player2.name}:${p2_wins}`);

            output.textContent = "Play again?";
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

const startButton = document.querySelector("#start");
startButton.addEventListener("click", ()=>main());

const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", ()=>{
    const gameWrapper = document.querySelector(".gameWrapper");
    for (let i = 0; i<9; i++) {
        gameWrapper.children[i].textContent = "";
    }
});