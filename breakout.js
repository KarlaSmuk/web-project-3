var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

let keyboardClicked = null;

//ball parameters
let ballX,
  ballY = 0;
const velocityX = 2;
const velocityY = -velocityX;

//initialize bricks
const brickRows = 8;
const brickColumns = 14;
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
        const brickX = j * (canvas.width / brickColumns);
        //row height
        const brickY = i * 20;

        ctx.beginPath();
        ctx.rect(brickX, brickY, canvas.width / brickColumns, 20);
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
  batX = canvas.width / 2 - 50;
  batY = canvas.height - 50;

  ctx.beginPath();
  ctx.rect(batX, batY, 100, 10);
  ctx.shadowBlur = 20;
  ctx.shadowColor = "black";
  ctx.fillStyle = "#0077b6";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  //canvas width to half and minus half ball radius to be on center
  ballX = canvas.width / 2 - 5;
  ballY = canvas.height / 2;

  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

function startGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBat();
  drawBall();
  drawBricks();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  startGame();
}

window.addEventListener("resize", resizeCanvas);

//keyboard click event
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      keyboardClicked = "left";
      break;
    case "ArrowRight":
      keyboardClicked = "right";
      break;
    default:
      return;
  }
});
