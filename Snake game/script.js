const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let gamePaused = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;


let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
};

const changeDirection = e => {
    if (gamePaused && e.key !== " ") {
        gamePaused = false;
        setIntervalId = setInterval(initGame, 100);
    }

    if (!gamePaused && !gameOver) {
        if (e.key === "ArrowUp" && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        } else if (e.key === "ArrowDown" && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (e.key === "ArrowLeft" && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        } else if (e.key === "ArrowRight" && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        }
    }

    if (e.key === " " && !gameOver) {
        if (!gamePaused) {
            gamePaused = true;
            clearInterval(setIntervalId);  
        }
    }
};

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver) return handleGameOver();

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([snakeY, snakeX]); 
        score++; 
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    
    snakeX += velocityX;
    snakeY += velocityY;

    
    if (snakeX <= 0) {
        snakeX = 30; 
    } else if (snakeX > 30) {
        snakeX = 1;   
    }
    if (snakeY <= 0) {
        snakeY = 30; 
    } else if (snakeY > 30) {
        snakeY = 1;  
    }

    
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    
    snakeBody[0] = [snakeY, snakeX]; 

    
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="${i === 0 ? "head" : "body"}" style="grid-area: ${snakeBody[i][0]} / ${snakeBody[i][1]}"></div>`;
        if (i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            gameOver = true; 
        }
    }

    playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
