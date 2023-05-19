
const puzzle = new Puzzle();
let solver;
let slider;

let fixed = {};

let start = [
  '-1547-269',
  '-423567-8',
  '-86----3-',
  '2-378----',
  '--7----9-',
  '4---61--2',
  '6--1-----',
  '--4---1-7',
  '----3794-',
]

function setup() {
  createCanvas(700, 800);
  frameRate(100);
  solver = new Solver(this.puzzle);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (start[r][c] !== '-') {
        puzzle.set(c, r, +start[r][c]);
        fixed[`${c}.${r}`] = true;
      }
    }
  }

  slider = createSlider(1, 100, 25);
  slider.position(10, 350);
  slider.style('width', '250px');
}

function drawStack() {
  push();
  translate(300, 38 * 20);

  const state = solver.getState();
  for (let i = 0; i < state.length; i++) {
    const s = state[i];
    text(`${i}. ${JSON.stringify(s)}`, 0, -i * 15);

  }
  pop();

}

function draw() {
  background(220);
  translate(20, 20);
  let solved = false;

  frameRate(slider.value());
  for (let i = 0; i < 1; i++) {
    solved = solver.step();

  }

  push();
  for (let y = 0; y < 3 * 3; y++) {
    for (let x = 0; x < 3 * 3; x++) {
      if (fixed[`${x}.${y}`]) {
        fill('lightgray');
      } else {
        fill('white');
      }

      const c = puzzle.get(x, y);
      push();
      translate(x * 30, y * 30);
      rect(0, 0, 30);
      fill('black');
      text(c ? c : '', 12, 15);
      pop()
    }
  }

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      strokeWeight(3);
      stroke('black');
      noFill();
      rect(x * 90, y * 90, 90);
    }
  }


  pop();
  drawStack();

  const top = solver.getState()[solver.getState().length - 1];
  push();
  stroke('red');
  noFill();
  strokeWeight(2);
  translate(top.x * 30, top.y * 30);
  rect(0, 0, 30);
  pop();

  if (solved) {
    frameRate(0);
  }
}

