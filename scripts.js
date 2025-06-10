const gameBoard = (() => {
    const gameArr = Array(9).fill("");
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
    return {name, marker}
}

const gameController = (() => {
    let player1, player2, isDone, current_player = false;

    const startGame = (name1, name2) => {
        player1 = player(name1 || "player1", "x");
        player2 = player(name2 || "player 2", "o");
        current_player = player1;
        isDone = false;
        gameBoard.resetBoard();
        gameDisplay.makeCells();
        gameDisplay.sendMsg(`${current_player.name}'s turn`);
    }

    const playTurn = (index) => {
        if (isDone || !gameBoard.setValue(index, current_player.marker)) return

        gameDisplay.updateCell(index, current_player.marker);

        if (gameController.checkTie()) {
            isDone = true;
            gameDisplay.sendMsg("Tied game");
            return
        }

        if (gameController.checkWinner(index)) {
            isDone = true;
            gameDisplay.sendMsg(`${current_player.name} is the winner!`);
            return
        }

        current_player = current_player == player1 ? player2 : player1;
        gameDisplay.sendMsg(`${current_player.name}'s turn`);
    }

    const checkTie = () => {
        return gameBoard.numFilled == 9
    }

    const checkWinner = (move) => {
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

    const resetGame = function() {
        if (!player1 || !player2) return
        gameController.startGame(player1.name, player2.name);
    }

    return {startGame, playTurn, resetGame, checkWinner, checkTie};
})();

// Acts as the interface between the user and the game logic
const gameDisplay = (() => { 
    const gameWrapper = document.querySelector(".gameWrapper");
    const output = document.querySelector("#output");

    // Makes 9 responsive game cells that call playGame() funtions when clicked
    const makeCells = function() {
        gameWrapper.innerHTML = ""; // will clear existing cells if game already played
        gameBoard.gameArr.forEach((val, pos)=>{
            const newCell = document.createElement("div");
            newCell.textContent = val;
            newCell.classList.add("gameCell");
            newCell.addEventListener("click", ()=>{
                gameController.playTurn(pos);
            });
            gameWrapper.appendChild(newCell);
        })
    }

    // When a user clicks a valid cell, that cells text content is updated with the user marker
    const updateCell = function(index, marker) {
        const cell = gameWrapper.children[index];
        cell.textContent = marker;
    }

    // Tells user info like game state (tied, won)
    const sendMsg = function(msg) {
        output.textContent = msg;
    }

    return {makeCells, updateCell, sendMsg}
})();

const startButton = document.querySelector("#start");
startButton.addEventListener("click", ()=>{
    const name1 = document.querySelector("#p1").value;
    const name2 = document.querySelector("#p2").value;
    gameController.startGame(name1, name2);
});

const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", ()=>{
    gameController.resetGame();
});