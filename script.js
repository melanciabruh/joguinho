const square = document.getElementById("square");
const bonus = document.getElementById("bonus");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const areaWidth = gameArea.clientWidth;
const areaHeight = gameArea.clientHeight;
const squareSize = 50;
const bonusSize = 40;

let score = 0;
let timeLeft = 40;
let gameActive = false;
let gamePaused = false;

let moveInterval, timerInterval;
let bonusTimeout, bonusInterval;

// Move quadrado vermelho
function moveSquare() {
    if (!gameActive || gamePaused) return;

    const maxX = areaWidth - squareSize;
    const maxY = areaHeight - squareSize;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    square.style.left = `${randomX}px`;
    square.style.top = `${randomY}px`;
}

// Move e exibe o bônus
function showBonus() {
    if (!gameActive || gamePaused) return;

    const maxX = areaWidth - bonusSize;
    const maxY = areaHeight - bonusSize;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    bonus.style.left = `${randomX}px`;
    bonus.style.top = `${randomY}px`;
    bonus.style.display = "block";

    // Oculta após 1 segundo
    bonusTimeout = setTimeout(() => {
        bonus.style.display = "none";
    }, 1000);

    // Reagenda o próximo bônus de 3 a 6 segundos
    const nextBonusTime = Math.floor(Math.random() * 3000) + 3000;
    bonusInterval = setTimeout(showBonus, nextBonusTime);
}

// Clique no quadrado vermelho
square.addEventListener("click", () => {
    if (!gameActive || gamePaused) return;
    score++;
    scoreDisplay.textContent = score;
    moveSquare();
});

// Clique no bônus dourado
bonus.addEventListener("click", () => {
    if (!gameActive || gamePaused) return;
    score += 2;
    scoreDisplay.textContent = score;
    bonus.style.display = "none";
    clearTimeout(bonusTimeout);
});

// Início do jogo
function startGame() {
    gameActive = true;
    gamePaused = false;
    score = 0;
    timeLeft = 40;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    square.style.display = "block";
    bonus.style.display = "none";

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    restartBtn.style.display = "none";
    pauseBtn.textContent = "⏸️ Pausar";

    moveSquare();
    moveInterval = setInterval(moveSquare, 1000);

    showBonus(); // Inicia os bônus

    timerInterval = setInterval(() => {
        if (!gamePaused) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;

            if (timeLeft <= 0) gameOver();
        }
    }, 1000);
}

// Pausar/continuar
function pauseGame() {
    if (!gameActive) return;

    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? "▶️ Continuar" : "⏸️ Pausar";

    if (!gamePaused) {
        moveSquare(); // move de novo se voltar do pause
    }
}

// Fim do jogo
function gameOver() {
    gameActive = false;
    clearInterval(moveInterval);
    clearInterval(timerInterval);
    clearTimeout(bonusTimeout);
    clearTimeout(bonusInterval);

    square.style.display = "none";
    bonus.style.display = "none";

    pauseBtn.disabled = true;
    restartBtn.style.display = "inline-block";

    alert(`⏰ Fim de jogo! Você fez ${score} ponto(s).`);
}

// Reinício
function restartGame() {
    startGame();
}

// Eventos dos botões
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
restartBtn.addEventListener("click", restartGame);
