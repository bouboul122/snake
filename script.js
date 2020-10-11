// Game board settings
const GROUND_IMG = new Image();
GROUND_IMG.src = "./Images/ground.png";
const BOX = 32;
const GAME_HEIGHT = 15;
const GAME_WIDTH = 17;
const canvas = document.getElementById('game-board');
const context = canvas.getContext('2d');


// Snake Settings
const SNAKE_BODY_COLOR = "#40A245";
const SNAKE_HEAD_COLOR = "#20BC45";
const SNAKE_BODY_PART_DIMENSIONS = BOX;
let snake = [];
snake[0] = {
  x: 9*BOX,
  y: 10*BOX,
};

// score settings
const SCORE_COLOR = "#FFFFFF";
const SCORE_X = 2*BOX;
const SCORE_Y = 1.6*BOX;
const SCORE_FONT = "45px Changa One";
let score = 0;
let highScore = 0;

// Food Settings
const FOOD_IMG = new Image();
FOOD_IMG.src = "./Images/Food.png";
const FOOD_WIDTH = BOX;
const FOOD_HEGIHT = BOX;
let isFoodOnScreen = true;
let food = {
  x: Math.floor(Math.random()*GAME_WIDTH + 1)*BOX,
  y: Math.floor(Math.random()*GAME_HEIGHT + 3)*BOX,
};

// Control Settings
const W = 87;
const A = 65;
const S = 83;
const D = 68;
const SPACE = 32;
const GAME_OVER = -1;
let gameHasStarted = false;
let DIRECTION;

// Audio Settings
const EAT = new Audio();
const DEAD = new Audio();
const THEME = new Audio();
EAT.src = "./Audio/eat.mp3";
DEAD.src = "./Audio/dead.mp3";
THEME.src = "./Audio/theme.mp3";


const direction = (event) => {
  if (event.keyCode === W && DIRECTION !== "DOWN") {
    DIRECTION = "UP";
  } else if (event.keyCode === D && DIRECTION !== "LEFT") {
    DIRECTION = "RIGHT";
  } else if (event.keyCode === S && DIRECTION !== "UP") {
    DIRECTION = "DOWN";
  } else if (event.keyCode === A && DIRECTION !== "RIGHT") {
    DIRECTION = "LEFT";
  }
};

const spacePressed = (event) => {
  if (event.keyCode === SPACE) {
    if (!gameHasStarted) {
      DIRECTION = "UP";
      gameHasStarted = true;
      THEME.play();
    } else {
      endGame();
      THEME.pause();
      THEME.currentTime = 0;
      gameHasStarted = false;
    }
  }
};

const upScore = () => {
  score ++;
};

const endGame = () => {
  DEAD.play();
  DIRECTION = undefined;
  snake = [];
  snake[0] = {
    x: 9*BOX,
    y: 10*BOX,
  };
  food = {
    x: Math.floor(Math.random()*GAME_WIDTH + 1)*BOX,
    y: Math.floor(Math.random()*GAME_HEIGHT + 3)*BOX,
  };
  isFoodOnScreen = true;
  if (score > highScore) {
    highScore = score;
  }
  score = 0;
};

const checkCollisions = () => {
  if (snake[0].y < 3*BOX) {
    return true;
  }
  if (snake[0].y > (GAME_HEIGHT+2)*BOX) {
    return true;
  }
  if (snake[0].x < BOX) {
    return true;
  }
  if (snake[0].x > GAME_WIDTH*BOX) {
    return true;
  };

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].y === snake[i].y && snake[0].x === snake[i].x) {
      return true;
    }
  };

  return false;
};

const moveSnake = () => {
  if (snake.length === 1) {
    if(DIRECTION === "UP" ) {
      snake[0].y -= BOX;
    } else if (DIRECTION === "DOWN") {
      snake[0].y += BOX;
    } else if (DIRECTION === "RIGHT") {
      snake[0].x += BOX;
    } else if (DIRECTION === "LEFT") {
      snake[0].x -= BOX;
    };
  } else {
    let oldTail = snake.pop();
    if(DIRECTION === "UP" ) {
      oldTail.y = snake[0].y - BOX;
      oldTail.x = snake[0].x;
    } else if (DIRECTION === "DOWN") {
      oldTail.y = snake[0].y + BOX;
      oldTail.x = snake[0].x;
    } else if (DIRECTION === "RIGHT") {
      oldTail.x = snake[0].x + BOX;
      oldTail.y = snake[0].y;
    } else if (DIRECTION === "LEFT") {
      oldTail.x = snake[0].x - BOX;
      oldTail.y = snake[0].y;
    };
    snake.unshift(oldTail);
  };
};

const eat = () => {
  EAT.play();
  let newHead = {}
  if(DIRECTION === "UP" ) {
    newHead.x = snake[0].x;
    newHead.y = snake[0].y - BOX;
  } else if (DIRECTION === "DOWN") {
    newHead.x = snake[0].x;
    newHead.y = snake[0].y + BOX;
  } else if (DIRECTION === "RIGHT") {
    newHead.x = snake[0].x + BOX;
    newHead.y = snake[0].y;
  } else if (DIRECTION === "LEFT") {
    newHead.x = snake[0].x - BOX;
    newHead.y = snake[0].y;
  };
  snake.unshift(newHead);
  upScore();
};

const drawFood = () => {
  food = {
    x: Math.floor(Math.random() * GAME_WIDTH + 1) * BOX,
    y: Math.floor(Math.random() * GAME_HEIGHT + 3) * BOX,
  };
};

const drawImages = () => {
  context.drawImage(GROUND_IMG, 0, 0);
  context.drawImage(FOOD_IMG, food.x, food.y);
};

const drawSnake = () => {
  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = (i===0? SNAKE_HEAD_COLOR: SNAKE_BODY_COLOR);
    context.fillRect(snake[i].x, snake[i].y, SNAKE_BODY_PART_DIMENSIONS, SNAKE_BODY_PART_DIMENSIONS);
  };
};

const drawText = () => {
  context.font = SCORE_FONT;
  context.fillStyle = SCORE_COLOR;
  context.fillText(score, SCORE_X, SCORE_Y);
  context.fillText("Best: "+ highScore, SCORE_X+2*BOX, SCORE_Y);
};

const play = () => {
  if (!gameHasStarted) {
    drawImages();
    drawSnake();
    drawText();
  } else {
    drawImages();
    if (!isFoodOnScreen) {
      drawFood();
      isFoodOnScreen = true;
    };

    if (snake[0].x === food.x && snake[0].y === food.y) {
      isFoodOnScreen = false;
      eat();
    } else {
      moveSnake();
    };

    if (checkCollisions()) {
      gameHasStarted = false;
      endGame();
    }

    drawSnake();
    drawText();
  };
};

document.addEventListener("keydown", direction);
document.addEventListener("keydown", spacePressed);
let game = setInterval(play, 100);