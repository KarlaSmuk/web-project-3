var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

let keyboardClicked = null;

//ball parameters
let ballX,
  ballY = 0;
const ballRadius = 10;
let angle = (Math.random() * Math.PI) / 4 + Math.PI / 8;
let velocityX = 3 * Math.cos(angle);
let velocityY = -3 * Math.sin(angle);

//bat parameters
let batX,
  batY = 0;
const batWidth = 100;
const batHeight = 30;

//initialize bricks
const brickRows = 8;
const brickColumns = 14;
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

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0077b6";
  ctx.fillText("Score: " + points, canvas.width - 120, 30);
  ctx.fillText(
    "Max Score: " + brickRows * brickColumns,
    canvas.width - 120,
    50
  );
}

function drawBricks() {
  for (let i = 0; i < brickRows; i++) {
    for (let j = 0; j < brickColumns; j++) {
      if (bricks[i][j].draw == true) {
        //column width
        brickWidth = canvas.width / brickColumns;
        const brickX = j * brickWidth;
        //row height
        const brickY = i * brickHeight + 100;

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
        batX -= 13;
      }
      break;
    case "ArrowRight":
      if (batX + batWidth < canvas.width) {
        batX += 13;
      }
      break;
    default:
      return;
  }
});

function checkBallCollision() {
  //check if ball out of canvas
  if (ballY - ballRadius > canvas.height) {
    drawGameOver();
    stopAnimation();
  }

  if (points == brickRows * brickColumns) {
    drawWin();
    stopAnimation();
  }

  // check if ball is in collision with bat
  if (
    //ball towards bat
    ballX + ballRadius > batX && //left edge of bat
    ballX - ballRadius < batX + batWidth && //right edge of bat
    ballY + ballRadius > batY && // bottom edge of brick
    ballY - ballRadius < batY + batHeight //  top edge of brick
  ) {
    const hitFromLeft = ballX + ballRadius > batX && ballX < batX; // Left
    const hitFromRight =
      ballX - ballRadius < batX + batWidth && ballX > batX + batWidth; // Right 
    const hitFromTop = ballY < batY; // Top 
    console.log("top ", hitFromTop);
    console.log("left ", hitFromLeft);
    console.log("right ", hitFromRight);
    console.log("bottom ", hitFromBottom);

    if (hitFromTop) {
      velocityY = -velocityY;
    }

    if ((hitFromLeft || hitFromRight) && !hitFromTop) {
      velocityX = -velocityX;
      ballX = ballX + ballRadius;
    }
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
  //flag if ball have collision with two bricks
  let checkVelocityChange = true;
  for (let i = 0; i < brickRows; i++) {
    for (let j = 0; j < brickColumns; j++) {
      const brick = bricks[i][j];
      if (brick.draw == true) {
        //check position of x
        //start                 //end
        if (
          ballX + ballRadius >= brick.x && //left edge of brick
          ballX - ballRadius <= brick.x + brickWidth && //right edge of brick
          ballY + ballRadius >= brick.y && // bottom edge of brick
          ballY - ballRadius <= brick.y + brickHeight //  top edge of brick
        ) {
          brick.draw = false;
          ++points;
          if (checkVelocityChange) {
            velocityY = -velocityY;
            checkVelocityChange = false;
          }

          if (points > localStorage.getItem("highestScore")) {
            localStorage.setItem("highestScore", points);
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
  drawScore();
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
