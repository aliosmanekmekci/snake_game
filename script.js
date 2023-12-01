let snake;
let food;
let direction = { x: 0, y: 0 };
let gameInterval;

function createBoard(boardSize) {
  columnCount = Math.sqrt(boardSize);
  const gameContainer = document.getElementById("gameContainer");
  for (let i = 0; i < boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameContainer.appendChild(cell);
  }
}

function drawSnake() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.classList.remove("snake"));

  snake.forEach((segment) => {
    const index = segment.y * columnCount + segment.x;
    if (index >= 0 && index < cells.length) {
      cells[index].classList.add("snake");
    }
  });
}

function drawFood() {
  const index = food.y * columnCount + food.x;
  const cell = document.querySelectorAll(".cell")[index];
  cell.classList.add("food");
}

function generateFood() {
  const newFood = {
    x: Math.floor(Math.random() * columnCount),
    y: Math.floor(Math.random() * columnCount),
  };
  const foodOverlap = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);

  // If the new food position is where the snake currently is, generate a new food position
  if (foodOverlap) {
    generateFood();
  } else {
    const index = food.y * columnCount + food.x;
    const cell = document.querySelectorAll(".cell")[index];
    cell.classList.remove("food");
    food = newFood;
    drawFood();
  }
}

function crash() {
  const head = snake[0];
  if (head.x < 0 || head.x >= columnCount || head.y < 0 || head.y >= columnCount || snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)) {
    const gameContainer = document.getElementById("gameContainer");
    gameContainer.style.display = "none"; // Hide the game board
    return true;
  }
  return false;
}

function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y !== 1) {
        direction = { x: 0, y: -1 };
      }
      break;
    case "ArrowDown":
      if (direction.y !== -1) {
        direction = { x: 0, y: 1 };
      }
      break;
    case "ArrowLeft":
      if (direction.x !== 1) {
        direction = { x: -1, y: 0 };
      }
      break;
    case "ArrowRight":
      if (direction.x !== -1) {
        direction = { x: 1, y: 0 };
      }
      break;
  }
}

function checkGameStatus() {
  if (gameInterval === null) {
    return;
  }

  const head = { ...snake[0] };
  head.x += direction.x;
  head.y += direction.y;

  snake.unshift({ ...head });

  const isFoodEaten = head.x === food.x && head.y === food.y;
  if (isFoodEaten) {
    generateFood();
  } else {
    snake.pop();
  }

  drawSnake();

  if (crash()) {
    clearInterval(gameInterval);
    document.getElementById("gameTitle").textContent = "Oyun bitti, skorun: " + snake.length - 1;
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.classList.remove("food"));
    cells.forEach((cell) => cell.classList.remove("snake"));
    const board = document.querySelector("#gameContainer");

    // Show the restart button
    document.getElementById("restartButton").style.display = "block";
    return; //Stop the function if there's a crash
  }
}

function startGame() {
  prepareGame();
  clearGameContainer();
  setupEventListeners();
  hideRestartButton();
  initializeGameBoard();
  startGameLoop();

  const gameContainer = document.getElementById("gameContainer");
  gameContainer.style.display = "grid"; // Show the game board
}

function prepareGame() {
  snake = [{ x: 7, y: 7 }];
  food = { x: 3, y: 3 };
  direction = { x: 0, y: 0 };

  gameInterval = null;
  document.getElementById("gameTitle").textContent = "Yılan Oyunu";
}

function clearGameContainer() {
  const gameContainer = document.getElementById("gameContainer");
  while (gameContainer.firstChild) {
    gameContainer.firstChild.remove();
  }
}

function setupEventListeners() {
  document.addEventListener("keydown", handleKeyPress);
}

function hideRestartButton() {
  document.getElementById("restartButton").style.display = "none";
}

function initializeGameBoard() {
  createBoard(225);
  generateFood();
}

function startGameLoop() {
  gameInterval = setInterval(checkGameStatus, 300);
}

function init() {
  document.getElementById("restartButton").addEventListener("click", startGame);
  startGame();
}

init();
