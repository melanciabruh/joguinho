const square = document.getElementById("square");
const bonus = document.getElementById("bonus");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const rankingList = document.getElementById("rankingList");

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

// ========== Funções do Jogo ==========

// Move o quadrado vermelho
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

    bonusTimeout = setTimeout(() => {
        bonus.style.display = "none";
    }, 1000);

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

// Iniciar o jogo
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
    showBonus();

    timerInterval = setInterval(() => {
        if (!gamePaused) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            if (timeLeft <= 0) gameOver();
        }
    }, 1000);
}

// Pausar / Continuar
function pauseGame() {
    if (!gameActive) return;

    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? "▶️ Continuar" : "⏸️ Pausar";

    if (!gamePaused) moveSquare();
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

    setTimeout(() => {
        const name = prompt(`⏰ Fim de jogo! Você fez ${score} ponto(s).\nDigite seu nome para entrar no ranking:`);

        if (name) {
            addToRanking(name, score);
        }

        updateRankingDisplay();
    }, 100);
}

// Reiniciar o jogo
function restartGame() {
    startGame();
}

// ========== Funções do Ranking ==========

// Adiciona ao ranking e salva no localStorage
function addToRanking(name, score) {
    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.push({ name, score });
    ranking.sort((a, b) => b.score - a.score); // Maior primeiro
    localStorage.setItem("ranking", JSON.stringify(ranking));
}

// Atualiza visualmente o ranking na tela
function updateRankingDisplay() {
    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    rankingList.innerHTML = "";

    ranking.slice(0, 5).forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score} pts`;
        rankingList.appendChild(li);
    });
}

// ========== Eventos dos botões ==========
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
restartBtn.addEventListener("click", restartGame);

// Exibe o ranking ao carregar
updateRankingDisplay();
