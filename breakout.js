var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

let keyboardClicked = null;

//ball parameters
let ballX,
  ballY = 0;
const ballRadius = 10;
const velocityX = 2;
const velocityY = -velocityX;

//bat parameters
let batX,
  batY = 0;
const batWidth = 100;
const batHeight = 10;

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
    bricks[i].push({ draw: true });
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

function drawBricks() {
  for (let i = 0; i < brickRows; i++) {
    for (let j = 0; j < brickColumns; j++) {
      if (bricks[i][j].draw == true) {
        //column width
        brickWidth = canvas.width / brickColumns;
        const brickX = j * brickWidth;
        //row height
        const brickY = i * brickHeight;

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
  //canvas width to half and minus half bat width to be on center

  ctx.beginPath();
  ctx.rect(batX, batY, batWidth, batHeight);
  ctx.shadowBlur = 20;
  ctx.shadowColor = "black";
  ctx.fillStyle = "#0077b6";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  //canvas width to half and minus half ball radius to be on center
  ballX = canvas.width / 2 - ballRadius / 2;
  ballY = canvas.height / 2;

  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

//keyboard click event
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      if (batX > 0) {
        batX -= 5;
      }
      break;
    case "ArrowRight":
      if (batX + batWidth < canvas.width) {
        batX += 5;
      }
      break;
    default:
      return;
  }
});

function startGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBat();
  drawBall();
  drawBricks();

  requestAnimationFrame(startGame); //loop
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  //initial position of bat
  batX = canvas.width / 2 - batWidth / 2;
  batY = canvas.height - 50;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
startGame();
