var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

let keyboardClicked = null;

//ball parameters
let ballX,
  ballY = 0;
const ballRadius = 10;
// let velocityX = 2.5;
// let velocityY = -velocityX;
let angle = (Math.random() * Math.PI) / 4 + Math.PI / 8;
let velocityX = 3 * Math.cos(angle);
let velocityY = -3 * Math.sin(angle);

//bat parameters
let batX,
  batY = 0;
const batWidth = 100;
const batHeight = 10;

//initialize bricks
const brickRows = 1;
const brickColumns = 2;
let brickWidth = canvas.width / brickColumns;
const brickHeight = 20;

let bricks = new Array();
for (let i = 0; i < brickRows; i++) {
  //row array
  bricks[i] = new Array();
  for (let j = 0; j < brickColumns; j++) {
    //column in row
    bricks[i].push({ x: 0, y: 0, draw: true });
  }
}

//points
let points = 0;
//highest score save to local storage
let highestScore = localStorage.getItem("highestScore");

function getColor(index) {
  switch (index) {
    case 2:
      return "#fb8500";
    case 3:
      return "#fb8500";
    case 4:
      return "#80b918";
    case 5:
      return "#80b918";
    case 6:
      return "#ffea00";
    case 7:
      return "#ffea00";
    default:
      return "#c1121f";
  }
}

function drawWin() {
  ctx.font = "60px Arial";
  ctx.fillStyle = "green";
  ctx.textAlign = "center";
  ctx.fillText("YOU WIN", canvas.width / 2, canvas.height / 2);
}

function drawGameOver() {
  ctx.font = "60px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
}

function drawBricks() {
  for (let i = 0; i < brickRows; i++) {
    for (let j = 0; j < brickColumns; j++) {
      if (bricks[i][j].draw == true) {
        //column width
        brickWidth = canvas.width / brickColumns;
        const brickX = j * brickWidth;
        //row height
        const brickY = i * brickHeight;

        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.shadowBlur = 20;
        ctx.shadowColor = "black";
        ctx.fillStyle = getColor(i);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBat() {
  ctx.beginPath();
  ctx.rect(batX, batY, batWidth, batHeight);
  ctx.shadowBlur = 20;
  ctx.shadowColor = "black";
  ctx.fillStyle = "#d90429";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0077b6";
  ctx.fill();
  ctx.closePath();
}

//keyboard click event
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      if (batX > 0) {
        batX -= 10;
      }
      break;
    case "ArrowRight":
      if (batX + batWidth < canvas.width) {
        batX += 10;
      }
      break;
    default:
      return;
  }
});

function checkBallCollision() {
  //check if ball out of canvas
  if (ballY > canvas.height) {
    drawGameOver();
    stopAnimation();
  }

  if (points == brickRows * brickColumns) {
    drawWin();
    stopAnimation();
  }

  // check if ball is in collision with bat
  if (
    ballY > canvas.height - batHeight - 50 &&
    ballY < canvas.height - 50 &&
    ballX - ballRadius < batX + batWidth &&
    ballX - ballRadius > batX
  ) {
    velocityY = -velocityY;
  }

  // check if ball is in collision with border of canvas
  if (ballX + ballRadius > canvas.width) {
    //right side
    velocityX = -velocityX;
  } else if (ballX - ballRadius < 0) {
    //left side
    velocityX = -velocityX;
  } else if (ballY - ballRadius <= 0) {
    //top
    velocityY = -velocityY;
  }

  //check if ball is in collision with brick
  for (let i = 0; i < brickRows; i++) {
    for (let j = 0; j < brickColumns; j++) {
      const brick = bricks[i][j];
      if (brick.draw == true) {
        //check position of x
        //start                 //end
        if (
          ballX - ballRadius > brick.x &&
          ballX - ballRadius < brick.x + brickWidth
        ) {
          //check position of y
          if (
            ballY - ballRadius > brick.y &&
            ballY - ballRadius < brick.y + brickHeight
          ) {
            brick.draw = false;
            ++points;
            velocityY = -velocityY;

            if (points > localStorage.getItem("highestScore")) {
              localStorage.setItem("highestScore", points);
            }
          }
        }
      }
    }
  }
}

function stopAnimation() {
  isAnimating = false;
}
let isAnimating = true;

function startGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBat();
  drawBall();
  drawBricks();

  //move ball
  ballX += velocityX;
  ballY += velocityY;

  checkBallCollision();
  if (isAnimating) {
    requestAnimationFrame(startGame); //loop
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  //initial position of bat
  //canvas width to half and minus half bat width to be on center
  batX = canvas.width / 2 - batWidth / 2;
  batY = canvas.height - 50;

  //center of bat
  ballX = batX + batWidth / 2;
  ballY = batY - batHeight;
}
//resize listener to auto refresh on resize
//game start from beginning
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
startGame();
