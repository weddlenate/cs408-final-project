// window.onload = loaded;

// set up canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const gameboard = document.getElementById("gameboard");

const width = (canvas.width = gameboard.offsetWidth);
const height = (canvas.height = gameboard.offsetHeight);

const gridRows = 10;
const gridCols = 20;
const blockHeight = height/gridCols;
const blockWidth = width/gridRows;
let grid = [];

for(let row = 0; row < gridRows; row++) {
  grid[row] = [];
  for(let col = 0; col < gridCols; col++) {
    grid[row][col] = "rgba(255, 255, 255, 0.25)";
  }
}

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



// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
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

class Tetrimino {
  constructor(shape, color) {
      this.shape = shape;
      this.color = color;
      this.x = 4;
      this.y = 1;
      this.rotation = 0;

      //Leftmost and rightmost x values to deal with collision at edge of grid
      switch (this.shape){
        case tetriminos[0]: //Shape == "I"
          this.xRight = 0;
          this.xLeft = 0;
          this.yBottom = 2;
          break;
        case tetriminos[1]: //Shape == "O"
          this.xRight = 1;
          this.xLeft = 0;
          this.yBottom = 0;
          break;
        case tetriminos[2]: //Shape == "J"
          this.xRight = 0;
          this.xLeft = -1;
          this.yBottom = 1;
          break;
        case tetriminos[3]: //Shape == "L"
          this.xRight = 1;
          this.xLeft = 0;
          this.yBottom = 1;
          break;
        case tetriminos[4]: //Shape == "T"
          this.xRight = 1;
          this.xLeft = -1;
          this.yBottom = 0;
          break;
        case tetriminos[5]: //Shape == "Z"
          this.xRight = 1;
          this.xLeft = -1;
          this.yBottom = 0;
          break;
        case tetriminos[6]: //Shape == "S"
          this.xRight = 1;
          this.xLeft = -1;
          this.yBottom = 0;
      }

      //When drawing shapes, need to check if they're at the edge of the grid, if so, substract xRight value/add xLeft value

      window.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "a": //Move the tetrimino left
          //Make a left x and right x?
            if((this.x + this.xLeft) > 0) {
              this.x--;
              this.draw();
            }
            break;
          case "d": //Move the tetrimino right
            if((this.x + this.xRight) < 9) {
              this.x++;
              this.draw();
            }
            break;
          // The square shouldn't be able to rotate at all
          // The S and Z pieces only need two different rotations
          case "ArrowLeft": //Rotate tetrimino counter clockwise
            if (this.shape == tetriminos[0]) { //Shape is "I"
              for (let block of this.shape) {
                if (this.rotation == 0) {
                  let newX = (block[1] * -1) + 1;
                  block[0] = newX;
                  block[1] = 0;
                  this.xRight = 2;
                  this.xLeft = -1;
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
                } else if (this.rotation == 180) {
                  let newX = (block[1] * -1) + 1;
                  block[0] = newX;
                  block[1] = 0;
                  this.xRight = 2;
                  this.xLeft = -1;
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
                }
              }
              this.draw();
              if (this.rotation == 0) {
                this.rotation = 270;
              } else {
                this.rotation -= 90;
              }
            } else if (this.shape == tetriminos[1]) { //Shape is "O"
              //"O" shouldn't rotate, so nothing happens when key is pressed
            } else if (this.shape == tetriminos[5] || this.shape == tetriminos[6]) { //Shape is "Z" or "S"
              for (let block of this.shape) {
                if (this.rotation == 0) {
                  let newX = block[1] * -1;
                  let newY = block[0];
                  block[0] = newX - 1;
                  block[1] = newY;
                  this.xRight = 0;
                  this.xLeft = -1;
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
                  switch (this.shape) {
                    case tetriminos[2]: //Shape is "J"
                      this.xRight = 1;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[3]: //Shape is "L"
                      this.xRight = 1;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[4]: //Shape is "T"
                      this.xRight = 0;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
              
                  }
                } else if (this.rotation == 90) {
                  switch (this.shape) {
                    case tetriminos[2]: //Shape is "J"
                      this.xRight = 0;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[3]: //Shape is "L"
                      this.xRight = 1;
                      this.xLeft = 0;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[4]: //Shape is "T"
                      this.xRight = 1;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                  }
                } else if (this.rotation == 180) {
                  switch (this.shape) {
                    case tetriminos[2]: //Shape is "J"
                      this.xRight = 1;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[3]: //Shape is "L"
                      this.xRight = 1;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[4]: //Shape is "T"
                      this.xRight = 1;
                      this.xLeft = 0;
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
                  switch (this.shape) {
                    case tetriminos[2]: //Shape is "J"
                      this.xRight = 1;
                      this.xLeft = 0;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[3]: //Shape is "L"
                      this.xRight = 0;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[4]: //Shape is "T"
                      this.xRight = 1;
                      this.xLeft = -1;
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
            break;
          case "ArrowRight": //Rotate tetrimino clockwise
            if (this.shape == tetriminos[0]) { //Shape is "I"
              for (let block of this.shape) {
                if (this.rotation == 0) {
                  let newX = (block[1] * -1) + 1;
                  block[0] = newX;
                  block[1] = 0;
                  this.xRight = 2;
                  this.xLeft = -1;
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
                } else if (this.rotation == 180) {
                  let newX = (block[1] * -1) + 1;
                  block[0] = newX;
                  block[1] = 0;
                  this.xRight = 2;
                  this.xLeft = -1;
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
                }
              }
              if (this.rotation == 270) {
                this.rotation = 0;
              } else {
                this.rotation += 90;
              }
              this.draw();
            } else if (this.shape == tetriminos[1]) { //Shape is "O"
              //"O" shouldn't rotate, so nothing happens when key is pressed
            } else if (this.shape == tetriminos[5] || this.shape == tetriminos[6]) { //Shape is "Z" or "S"
              for (let block of this.shape) {
                if (this.rotation == 0) {
                  let newX = block[1] * -1;
                  let newY = block[0];
                  block[0] = newX;
                  block[1] = newY;
                  this.xRight = 1;
                  this.xLeft = 0;
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
                  switch (this.shape) {
                    case tetriminos[2]: //Shape is "J"
                      this.xRight = 1;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[3]: //Shape is "L"
                      this.xRight = 1;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[4]: //Shape is "T"
                      this.xRight = 1;
                      this.xLeft = 0;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
              
                  }
                } else if (this.rotation == 90) {
                  switch (this.shape) {
                    case tetriminos[2]: //Shape is "J"
                      this.xRight = 1;
                      this.xLeft = 0;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[3]: //Shape is "L"
                      this.xRight = 0;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[4]: //Shape is "T"
                      this.xRight = 1;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                  }
                } else if (this.rotation == 180) {
                  switch (this.shape) {
                    case tetriminos[2]: //Shape is "J"
                      this.xRight = 1;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[3]: //Shape is "L"
                      this.xRight = 1;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[4]: //Shape is "T"
                      this.xRight = 0;
                      this.xLeft = -1;
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
                  switch (this.shape) {
                    case tetriminos[2]: //Shape is "J"
                      this.xRight = 0;
                      this.xLeft = -1;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[3]: //Shape is "L"
                      this.xRight = 1;
                      this.xLeft = 0;
                      if ((this.x + this.xRight) > 9) { 
                        this.x -= 1;
                      }
                      if ((this.x + this.xLeft) < 0) { 
                        this.x += 1;
                      }
                      break;
                    case tetriminos[4]: //Shape is "T"
                      this.xRight = 1;
                      this.xLeft = -1;
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
        
      });
  }

  draw() {
    for (const block of this.shape) { //Iterates through shape array to get every block's offest values
      ctx.fillStyle = this.color; //Sets color of block
      ctx.fillRect((this.x + block[0]) * blockWidth, (this.y + block[1]) * blockHeight, blockWidth, blockHeight);
    }
  }

  fall(){
    this.y++;
    this.draw()
  }

  move() {

  }

  rotate() {

  }
}

const tetrimino = new Tetrimino(tetriminos[0], "blue");

// let start = new Date();
// let secondsStart = start.getSeconds();

function loop() {
  ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);

  // const now = new Date();
  // const secondsNow = now.getSeconds();
  // if (secondsNow > secondsStart) {
  //   tetrimino.fall();
  //   secondsStart++;
  // }


  drawGrid();
  tetrimino.draw();

  requestAnimationFrame(loop);
}

loop();
