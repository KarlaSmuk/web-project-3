var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

let keyboardClicked = null;

//ball parameters
let ballX,
  ballY = 0;
const ballRadius = 10;
let angle = (Math.random() * Math.PI) / 4 + Math.PI / 8;
let velocityX = 4 * Math.cos(angle);
let velocityY = -4 * Math.sin(angle);

//bat parameters
let batX,
  batY = 0;
const batWidth = 100;
const batHeight = 10;

//initialize bricks
const brickRows = 2; // less rows for easier testing
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

//return color of brick depends of row index
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
  ctx.fillText("YOU W0N", canvas.width / 2, canvas.height / 2);
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
    "Max Score: " +
      (localStorage.getItem("highestScore") == null
        ? 0
        : localStorage.getItem("highestScore")),
    canvas.width - 120,
    50
  );
}

function drawBricks() {
  for (let i = 0; i < brickRows; i++) {
    for (let j = 0; j < brickColumns; j++) {
      if (bricks[i][j].draw == true) {
        //column width
        //calculate brick width to fill entire canvas width
        brickWidth = canvas.width / brickColumns;
        const brickX = j * brickWidth;
        //row height
        const brickY = i * brickHeight + 100;

        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;

        ctx.beginPath();
        //x and y positions are from left and top edge of brick
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
  //x and y positions are from left and top edge of bat
  ctx.rect(batX, batY, batWidth, batHeight);
  ctx.shadowBlur = 20;
  ctx.shadowColor = "black";
  ctx.fillStyle = "#d90429";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  //x and y positions are from the center of ball
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
        batX -= 15;
      }
      break;
    case "ArrowRight":
      if (batX + batWidth < canvas.width) {
        batX += 15;
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

  //check ball and bat collision
  let closestX = ballX;
  let closestY = ballY;
  //check which edge is ball closest to
  //x axis
  //left right
  if (ballX > batX + batWidth) {
    closestX = batX + batWidth;
  } else if (ballX < batX) {
    closestX = batX;
  }
  //check which edge is ball closest to
  //y axis
  //left right
  if (ballY > batY + batHeight) {
    closestY = batY + batHeight;
  } else if (ballY < batY) {
    closestY = batY;
  }
  //distance between ball center and closest edge
  let distanceX = closestX - ballX;
  let distanceY = closestY - ballY;
  let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

  //if the distance is less than the ball radius squared
  //collision
  if (distance <= ballRadius) {
    const hitFromLeft = ballX < batX && distanceX >= 0;
    const hitFromRight = ballX > batX + batWidth && distanceX <= 0;
    const hitFromTop = ballY < batY && distanceY >= 0;

    //if hit from top change y velocity
    if (hitFromTop) {
      // Position it above the bat to not sticky to bat
      ballY = batY - ballRadius;
      velocityY = -velocityY;
    }

    //if hit from side change x velocity
    if (
      hitFromLeft ||
      hitFromRight ||
      (hitFromTop && hitFromLeft) ||
      (hitFromTop && hitFromRight)
    ) {
      //prevent ball get inside bat when bat is moving
      if (hitFromRight) ballX = batX + batWidth + ballRadius;
      if (hitFromLeft) ballX = batX - ballRadius;
      if (hitFromTop) ballY = batY - ballRadius;
      velocityX = -velocityX;
    }
  }

  // check if ball is in collision with border of canvas
  if (ballX + ballRadius > canvas.width) {
    //right
    velocityX = -velocityX;
  } else if (ballX - ballRadius < 0) {
    //left
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
        //check position of ball
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
  batY = canvas.height - batHeight * 2;

  //center of bat
  ballX = batX + batWidth / 2;
  ballY = batY - batHeight;
}
//resize listener to auto refresh on resize
//game start from beginning
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
startGame();
