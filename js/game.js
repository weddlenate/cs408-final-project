
// set up canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const gameboard = document.getElementById("gameboard");

const lineBoard = document.getElementById("gamelines");
const timeClock = document.getElementById("gametime");
const scoreBoard = document.getElementById("gamescore");
const gameOverScreen = document.getElementById("gameover");

const width = (canvas.width = gameboard.offsetWidth);
const height = (canvas.height = gameboard.offsetHeight);

//Set up game grid
const gridRows = 10;
const gridCols = 20;
const blockHeight = height/gridCols;
const blockWidth = width/gridRows;
let grid = [];
let gridOccupied = []; //determine which places have a piece on them

//Set up user statistics
let score = 0;
let lines = 0;
let singles = 0;
let doubles = 0;
let triples = 0;
let tetrises = 0;

//Timer functionallity
let seconds = 0;
let minutes = 0;
let timerInterval;

function updateTimer() {
  if (seconds == 59) {
    seconds = 0;
    minutes++;
  } else {
    seconds++;
  }
  timeClock.innerHTML = `<h2>Time</h2><p>${formatMinutes(minutes)}:${formatSeconds(seconds)}</p>`;
  console.log("Seconds:", seconds);
}

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000); // Update every 1000ms (1 second)
}

function stopTimer() {
  let gameTime = minutes + ":" + seconds;
  clearInterval(timerInterval);
  return gameTime;
}

function formatMinutes(minutes) {
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return minutes;
}

function formatSeconds(seconds) {
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return seconds;
}

//Display current lines, time, and score
lineBoard.innerHTML = `<h2>Lines</h2><p>${lines}</p>`;
timeClock.innerHTML = `<h2>Time</h2><p>${formatMinutes(minutes)}:${formatSeconds(seconds)}</p>`;
scoreBoard.innerHTML = `<h2>Score</h2><p>${score}</p>`;

//Initialize the game grid to all white
for(let row = 0; row < gridRows; row++) {
  grid[row] = [];
  gridOccupied[row] = [];
  for(let col = 0; col < gridCols; col++) {
    grid[row][col] = "rgba(255, 255, 255, 0.25)";
    gridOccupied[row][col] = 0;
  }
}

//Draw the game grid on the canvas
function drawGrid() {
  for(let row = 0; row < gridRows; row++) {
    for(let col = 0; col < gridCols; col++) {
      ctx.fillStyle = grid[row][col];
      ctx.fillRect(row * blockWidth, col * blockHeight, blockWidth, blockHeight);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.lineWidth = 2;
      ctx.strokeRect(row * blockWidth, col * blockHeight, blockWidth, blockHeight);
    }
  }
}

//Looks to see if a row is fully occupied
function rowComplete() {
  let completedLines = 0;
  for(let col = 19; col > 0; col--) {
    let complete = true;
    for(let row = 0; row < gridRows; row++) {
      if(gridOccupied[row][col] !== 1) {
        complete = false;
      }
    }
    //If a row is fully occupied, then slide all rows above it down
    if(complete) {
      for(let newCol = col; newCol >= 0; newCol--) {
        for(let newRow = 0; newRow < gridRows; newRow++) {
          if (newCol == 0) {
            grid[newRow][newCol] = "rgba(255, 255, 255, 0.25)";
            gridOccupied[newRow][newCol] = 0;
          } else {
            grid[newRow][newCol] = grid[newRow][newCol-1];
            gridOccupied[newRow][newCol] = gridOccupied[newRow][newCol-1];
          }
        }
      }
      completedLines++
      lines++;
      col++;
    }
  }
  //Add to the score based on the number of lines removed
  switch (completedLines) {
    case 0:
      break;
    case 1:
      singles++;
      score += 40;
      completeLines = 0;
      break;
    case 2:
      doubles++;
      score += 100;
      completeLines = 0;
      break;
    case 3:
      triples++;
      score += 300;
      completeLines = 0;
      break;
    case 4:
      tetrises++;
      score += 1200;
      completeLines = 0;
  }
  lineBoard.innerHTML = `<h2>Lines</h2><p>${lines}</p>`
  scoreBoard.innerHTML = `<h2>Score</h2><p>${score}</p>`
}

//Updates the grid when a tetrimino 'dies'
function updateGrid(tetrimino) {
  for (const block of tetrimino.shape) { //Iterates through shape array to get every block's offest values
    grid[tetrimino.x + block[0]][tetrimino.y + block[1]] = tetrimino.color;
    gridOccupied[tetrimino.x + block[0]][tetrimino.y + block[1]] = 1; 
  }
  return rowComplete();
}

//Tetrimino shapes composed of xy coords of blocks in relation to current position on the grid
const tetriminos = [
  [[0,-1],[0,0],[0,1],[0,2]], //I
  [[0,-1],[0,0],[1,-1],[1,0]], //O
  [[0,-1],[0,0],[0,1],[-1,1]], //J
  [[0,-1],[0,0],[0,1],[1,1]], //L
  [[0,-1],[0,0],[-1,0],[1,0]], //T
  [[0,-1],[0,0],[-1,-1],[1,0]], //Z
  [[0,-1],[0,0],[-1,0],[1,-1]]  //S
];

//Tetrimino "Letters". Used to identify shapes without changing x and y offsets
const tetriminoLetters = [
  "I",
  "O",
  "J",
  "L",
  "T",
  "Z",
  "S"
]

//Tetrimino colors
const colors = [
  "cyan", //I
  "yellow", //O
  "blue", //J
  "orange", //L
  "purple", //T
  "red", //Z
  "green" //S
]

class Tetrimino {
  constructor(shape, color) {
      //this.shape = shape;
      this.shapeLetter = shape;
      this.color = color;
      this.x = 4;
      this.y = 1;
      this.rotation = 0;
      this.active = true;
      //Initializes specific block values of the tetrimino depending on the shape
      switch (shape){
        case "I": //Shape == "I"
          this.shape = [[0,-1],[0,0],[0,1],[0,2]];
          this.height = 4;
          this.xRight = 0;
          this.xLeft = 0;
          this.yBottom = 2;
          break;
        case "O": //Shape == "O"
          this.shape = [[0,-1],[0,0],[1,-1],[1,0]];
          this.height = 2;
          this.xRight = 1;
          this.xLeft = 0;
          this.yBottom = 0;
          break;
        case "J": //Shape == "J"
          this.shape = [[0,-1],[0,0],[0,1],[-1,1]];
          this.height = 3;
          this.xRight = 0;
          this.xLeft = -1;
          this.yBottom = 1;
          break;
        case "L": //Shape == "L"
          this.shape = [[0,-1],[0,0],[0,1],[1,1]];
          this.height = 3;
          this.xRight = 1;
          this.xLeft = 0;
          this.yBottom = 1;
          break;
        case "T": //Shape == "T"
          this.shape = [[0,-1],[0,0],[-1,0],[1,0]];
          this.height = 2;
          this.xRight = 1;
          this.xLeft = -1;
          this.yBottom = 0;
          break;
        case "Z": //Shape == "Z"
          this.shape = [[0,-1],[0,0],[-1,-1],[1,0]];
          this.height = 3;
          this.xRight = 1;
          this.xLeft = -1;
          this.yBottom = 0;
          break;
        case "S": //Shape == "S"
          this.shape =  [[0,-1],[0,0],[-1,0],[1,-1]];
          this.height = 3;
          this.xRight = 1;
          this.xLeft = -1;
          this.yBottom = 0;
      }

      //Event listener to listen to WASD keys and Arrow keys
      window.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "a": //Move the tetrimino left
            this.moveLeft();
            break;
          case "d": //Move the tetrimino right
            this.moveRight();
            break;
          case "w":
            //this.fall();
            break;
          case "s":
            this.moveDown();
            break;
          // The square shouldn't be able to rotate at all
          // The S and Z pieces only need two different rotations
          case "ArrowLeft": //Rotate tetrimino counter clockwise
            this.rotateCCW();
            break;
          case "ArrowRight": //Rotate tetrimino clockwise
            this.rotateCW();
        }
      });
  }

  draw() {
    for (const block of this.shape) { //Iterates through shape array to get every block's offest values
      ctx.fillStyle = this.color; //Sets color of block
      ctx.fillRect((this.x + block[0]) * blockWidth, (this.y + block[1]) * blockHeight, blockWidth, blockHeight);
    }
  }

  //Moves a tetrimino down the game board 1 block
  fall(){
    this.y++;
    this.draw()
  }

  //Quickly moves the piece to the bottom of the board
  moveDown() {
    let stop = false;
    while (stop == false) {
      for (const block of tetrimino.shape) { //Iterates through shape array to get every block's offest values
        if (gridOccupied[tetrimino.x + block[0]][tetrimino.y + block[1] + 1] == 1) {
          stop = true;
          updateGrid(tetrimino);
          tetrimino.active = false;
          randomShape = getRandomInt(0, 6);
          tetrimino = new Tetrimino(tetriminoLetters[randomShape], colors[randomShape]);
        }
      }
      if (this.y + this.yBottom == 19) {
        stop = true;
        this.y = 19 - this.yBottom;
      }
      this.y++;
    }
    this.y = 19 - this.yBottom;
  }

  //Moves the active tetrimino to the right
  moveRight() {
    if (this.active) {
      let move = true;
      for (const block of tetrimino.shape) {
        if (gridOccupied[tetrimino.x + block[0] + 1][tetrimino.y + block[1]] == 1) {
          move = false;
        }
      }
      if (move) {
        this.x++;
        this.draw();
      }
    }
  }

  //Moves the active tetrimino to the left
  moveLeft() {
    if (this.active) {
      let move = true;
      for (const block of tetrimino.shape) {
        if (gridOccupied[tetrimino.x + block[0] - 1][tetrimino.y + block[1]] == 1) {
          move = false;
        }
      }
      if (move) {
        this.x--;
        this.draw();
      }
    }
  }

  //Rotates the tetrimino clock wise
  rotateCW() {
    if (this.active) {
      if (this.shapeLetter == "I") { //Shape is "I"
        for (let block of this.shape) {
          if (this.rotation == 0) {
            let newX = (block[1] * -1) + 1;
            block[0] = newX;
            block[1] = 0;
            this.xRight = 2;
            this.xLeft = -1;
            this.yBottom = 0;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 2;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          } else if (this.rotation == 90) {
            let newY = (block[0] * -1) + 1;
            block[0] = 1;
            block[1] = newY;
            this.xRight = 1;
            this.xLeft = 1;
            this.yBottom = 1;
          } else if (this.rotation == 180) {
            let newX = (block[1] * -1) + 1;
            block[0] = newX;
            block[1] = 0;
            this.xRight = 2;
            this.xLeft = -1;
            this.yBottom = 0;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 1;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          } else { //this.rotation == 270
            let newY = (block[0] * -1) + 1;
            block[0] = 0;
            block[1] = newY;
            this.xRight = 0;
            this.xLeft = 0;
            this.yBottom = 2;
          }
        }
        if (this.rotation == 270) {
          this.rotation = 0;
        } else {
          this.rotation += 90;
        }
        this.draw();
      } else if (this.shapeLetter == "O") { //Shape is "O"
        //"O" shouldn't rotate, so nothing happens when key is pressed
      } else if (this.shapeLetter == "Z" || this.shapeLetter == "S") { //Shape is "Z" or "S"
        for (let block of this.shape) {
          if (this.rotation == 0) {
            let newX = block[1] * -1;
            let newY = block[0];
            block[0] = newX;
            block[1] = newY;
            this.xRight = 1;
            this.xLeft = 0;
            this.yBottom = 1;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 1;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          } else if (this.rotation == 90) {
            let newX = block[1] * -1;
            let newY = block[0] - 1;
            block[0] = newX;
            block[1] = newY;
            this.xRight = 1;
            this.xLeft = -1;
            this.yBottom = 0;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 1;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          } else if (this.rotation == 180) {
            let newX = block[1] * -1;
            let newY = block[0];
            block[0] = newX - 1;
            block[1] = newY;
            this.xRight = 0;
            this.xLeft = -1;
            this.yBottom = 1;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 1;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          } else { //this.rotation == 270
            let newX = block[1] * -1;
            let newY = block[0] - 1;
            block[0] = newX;
            block[1] = newY + 1;
            this.xRight = 1;
            this.xLeft = -1;
            this.yBottom = 0;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 1;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          }
        }
        this.draw();
        if (this.rotation == 270) {
          this.rotation = 0;
        } else {
          this.rotation += 90;
        }
      } else { //Shape is "L", "J", or "T"
        for (let block of this.shape) {
          //All of these shapes rotate around a single point
          let newX = block[1] * -1;
          let newY = block[0];
          block[0] = newX;
          block[1] = newY;
          //Edge cases with side of grid
          if (this.rotation == 0) {
            switch (this.shapeLetter) {
              case "J": //Shape is "J"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 0;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "L": //Shape is "L"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "T": //Shape is "T"
                this.xRight = 1;
                this.xLeft = 0;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
        
            }
          } else if (this.rotation == 90) {
            switch (this.shapeLetter) {
              case "J": //Shape is "J"
                this.xRight = 1;
                this.xLeft = 0;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "L": //Shape is "L"
                this.xRight = 0;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "T": //Shape is "T"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
            }
          } else if (this.rotation == 180) {
            switch (this.shapeLetter) {
              case "J": //Shape is "J"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 0;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "L": //Shape is "L"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "T": //Shape is "T"
                this.xRight = 0;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
            }
          } else { //this.rotation == 270
            this.xRight = 0;
            this.xLeft = -1;
            switch (this.shapeLetter) {
              case "J": //Shape is "J"
                this.xRight = 0;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "L": //Shape is "L"
                this.xRight = 1;
                this.xLeft = 0;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "T": //Shape is "T"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 0;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
            }
          }
        }
        this.draw();
        if (this.rotation == 270) {
          this.rotation = 0;
        } else {
          this.rotation += 90;
        }
      } 
    }
  }

  //Rotates the tetrimino counter clockwise
  rotateCCW() {
    if (this.active) {
      if (this.shapeLetter == "I") { //Shape is "I"
        for (let block of this.shape) {
          if (this.rotation == 0) {
            let newX = (block[1] * -1) + 1;
            block[0] = newX;
            block[1] = 0;
            this.xRight = 2;
            this.xLeft = -1;
            this.yBottom = 0;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 2;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          } else if (this.rotation == 90) {
            let newY = (block[0] * -1) + 1;
            block[0] = 0;
            block[1] = newY;
            this.xRight = 0;
            this.xLeft = 0;
            this.yBottom = 2;
          } else if (this.rotation == 180) {
            let newX = (block[1] * -1) + 1;
            block[0] = newX;
            block[1] = 0;
            this.xRight = 2;
            this.xLeft = -1;
            this.yBottom = 0;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 1;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          } else { //this.rotation == 270
            let newY = (block[0] * -1) + 1;
            block[0] = 1;
            block[1] = newY;
            this.xRight = 1;
            this.xLeft = 1;
            this.yBottom = 1;
          }
        }
        this.draw();
        if (this.rotation == 0) {
          this.rotation = 270;
        } else {
          this.rotation -= 90;
        }
      } else if (this.shapeLetter == "O") { //Shape is "O"
        //"O" shouldn't rotate, so nothing happens when key is pressed
      } else if (this.shapeLetter == "Z" || this.shapeLetter == "S") { //Shape is "Z" or "S"
        for (let block of this.shape) {
          if (this.rotation == 0) {
            let newX = block[1] * -1;
            let newY = block[0];
            block[0] = newX - 1;
            block[1] = newY;
            this.xRight = 0;
            this.xLeft = -1;
            this.yBottom = 1;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 1;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          } else if (this.rotation == 90) {
            let newX = block[1] * -1;
            let newY = block[0] - 1;
            block[0] = newX;
            block[1] = newY;
            this.xRight = 1;
            this.xLeft = -1;
            this.yBottom = 0;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 1;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          } else if (this.rotation == 180) {
            let newX = block[1] * -1;
            let newY = block[0];
            block[0] = newX;
            block[1] = newY;
            this.xRight = 1;
            this.xLeft = 0;
            this.yBottom = 1;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 1;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          } else { //this.rotation == 270
            let newX = block[1] * -1;
            let newY = block[0] - 1;
            block[0] = newX;
            block[1] = newY + 1;
            this.xRight = 1;
            this.xLeft = -1;
            this.yBottom = 0;
            if ((this.x + this.xRight) > 9) { 
              this.x -= 1;
            }
            if ((this.x + this.xLeft) < 0) { 
              this.x += 1;
            }
          }
        }
        this.draw();
        if (this.rotation == 0) {
          this.rotation = 270;
        } else {
          this.rotation -= 90;
        }
      } else { //Shape is "L", "J", or "T"
        for (let block of this.shape) {
          let newX = block[1];
          let newY = block[0] * -1;
          block[0] = newX;
          block[1] = newY;
          //Edge cases with side of grid
          if (this.rotation == 0) {
            switch (this.shapeLetter) {
              case "J": //Shape is "J"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "L": //Shape is "L"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 0;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "T": //Shape is "T"
                this.xRight = 0;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
        
            }
          } else if (this.rotation == 90) {
            switch (this.shapeLetter) {
              case "J": //Shape is "J"
                this.xRight = 0;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "L": //Shape is "L"
                this.xRight = 1;
                this.xLeft = 0;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "T": //Shape is "T"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 0;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
            }
          } else if (this.rotation == 180) {
            switch (this.shapeLetter) {
              case "J": //Shape is "J"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 0;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "L": //Shape is "L"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "T": //Shape is "T"
                this.xRight = 1;
                this.xLeft = 0;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
            }
          } else { //this.rotation == 270
            this.xRight = 0;
            this.xLeft = -1;
            switch (this.shapeLetter) {
              case "J": //Shape is "J"
                this.xRight = 1;
                this.xLeft = 0;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "L": //Shape is "L"
                this.xRight = 0;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
                break;
              case "T": //Shape is "T"
                this.xRight = 1;
                this.xLeft = -1;
                this.yBottom = 1;
                if ((this.x + this.xRight) > 9) { 
                  this.x -= 1;
                }
                if ((this.x + this.xLeft) < 0) { 
                  this.x += 1;
                }
            }
          }
        }
        this.draw();
        if (this.rotation == 0) {
          this.rotation = 270;
        } else {
          this.rotation -= 90;
        }
      }
    }
  }
}

//Function to generate a random integer between the given min and max value
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Sets up the start of the game
let gameover = false;
let randomShape = getRandomInt(0, 6);
let tetrimino = new Tetrimino(tetriminoLetters[randomShape], colors[randomShape]);
let start = new Date();
let secondsStart = start.getSeconds();
startTimer();

function loop() {
  ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);
  
  //Sets how fast the active tetrimino passively falls down the game board
  let now = new Date();
  let secondsNow = now.getSeconds();
  if (secondsNow > secondsStart) {
    if (secondsNow == 59 && secondsStart != 0) {
      tetrimino.fall();
      secondsStart = 0;
    } else if (secondsNow != 59){
      tetrimino.fall();
      secondsStart = secondsNow;
    }
  }

  //Checks to see if the active piece has reached the bottom of the board or the user has lost
  for (const block of tetrimino.shape) { //Iterates through shape array to get every block's offest values
    if (gridOccupied[tetrimino.x + block[0]][tetrimino.y + block[1] + 1] == 1) {
      if (tetrimino.y == 1) {
        gameover = true;
        tetrimino.active = false;
      } else {
        updateGrid(tetrimino);
        tetrimino.active = false;
        randomShape = getRandomInt(0, 6);
        tetrimino = new Tetrimino(tetriminoLetters[randomShape], colors[randomShape]);
      }
    }
  }

  //Checks to see if tetrimino is at the bottom of the game board
  if ((tetrimino.y  + tetrimino.yBottom) == 19) {
    updateGrid(tetrimino);
    tetrimino.active = false;
    randomShape = getRandomInt(0, 6);
    tetrimino = new Tetrimino(tetriminoLetters[randomShape], colors[randomShape]);
  }
  
  //Draws the current game board and tetrimino
  drawGrid();
  tetrimino.draw();
}

//Updates data for user, sends it to database
function updateTable(obj, time, username) {
  //Iterate through each item currently in the database
  for (const item of obj) {
    //Check to see if current data is the user's data
    if (item.id == username) {
      //Updates all the databases scores
      let newScore = score > item.score ? score : item.score;
      let newTime = time > item.time ? time : item.time;
      let newLines = lines > item.lines ? lines : item.lines;
      let newSingles = item.singles + singles;
      let newDoubles = item.doubles + doubles;
      let newTriples = item.triples + triples;
      let newTetrises = item.tetrises + tetrises;

      //Sends updated values to database
      xhr = new XMLHttpRequest();
      //Sends request with user inputs
      xhr.open("PUT", "https://7p6ec3iwhf.execute-api.us-east-2.amazonaws.com/items");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({
          "id": username,
          "time": newTime,
          "lines": newLines,
          "score": newScore,
          "singles": newSingles,
          "doubles": newDoubles,
          "triples": newTriples,
          "tetrises": newTetrises
      }));
    }
  }
}

function game() {
  //Checks to see if the game is over
  if (gameover) {
    let time = stopTimer();
    const username = JSON.parse(localStorage.getItem('username'));
    gameOverScreen.style.display = "block";
    let xhr = new XMLHttpRequest();
    //Updates values
    xhr.addEventListener("load", function () {
        const dataText = xhr.response;
        const data = JSON.parse(dataText);

        updateTable(data, time, username);        
    });
    xhr.open("GET", "https://7p6ec3iwhf.execute-api.us-east-2.amazonaws.com/items");
    xhr.send();
  } else {
    loop();
    requestAnimationFrame(game);
  }
}

game();
