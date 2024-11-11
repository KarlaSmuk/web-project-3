var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

//ball parameters
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
const velocityX = 2;
const velocityY = -velocityX;

//brickets parameters
const brickRow = 8;
const brickColumn = 14;

//points
let points = 0;
//highest score save to local storage
let highestScore = localStorage.getItem("highestScore");

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

function startGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;

  startGame();
}

window.addEventListener("resize", resizeCanvas);
