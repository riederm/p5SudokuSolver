
const puzzle = new Puzzle();
let solver;
let slider;
let running = false;


let fixed = {};

const CELL_WIDTH = 30;

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

  const y = 9*CELL_WIDTH+30;
  slider = createSlider(1, 100, 25);
  slider.position(150, y);
  slider.style('width', '150px');

  let playButton = createButton('solve ');
  let stepButton = createButton('step')
  playButton.position(20, y);
  playButton.mousePressed(() => {
    running = !running;

    playButton.html(running ? 'pause' : 'solve ');
    if (running) {
      stepButton.attribute('disabled', '');
    } else {
      stepButton.removeAttribute('disabled');
    }
  });

  stepButton.position(75, y);
  stepButton.mousePressed(() => {
    solver.step();
  });
}

function drawStack() {
  push();
  translate(300, 38 * 20);

  const state = solver.getState();
  for (let i = 0; i < state.length; i++) {
    const s = state[i];
    text(`${('' + i).padStart(2, '0')}.     x: ${s.x}, y: ${s.y}, ${JSON.stringify(s.numbers)}`, 0, -i * 15);
  }
  pop();

}

function draw() {
  background(220);
  translate(20, 20);
  let solved = false;

  frameRate(slider.value());
  if (running) {
    solved = solver.step();
  }

  drawRaster();
  drawHighlighter();
  drawStack();

  if (solved) {
    frameRate(0);
  }
}

function drawRaster() {
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
      translate(x * CELL_WIDTH, y * CELL_WIDTH);
      rect(0, 0, CELL_WIDTH);
      fill('black');
      text(c ? c : '', 12, 15);
      pop();
    }
  }

  // draw 3by3 Raster
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      strokeWeight(3);
      stroke('black');
      noFill();
      rect(x * 3*CELL_WIDTH, y * 3*CELL_WIDTH, 3*CELL_WIDTH);
    }
  }
  pop();
}

function drawHighlighter() {
  const top = solver.getState()[solver.getState().length - 1];
  push();
  stroke('red');
  noFill();
  strokeWeight(2);
  translate(top.x * CELL_WIDTH, top.y * CELL_WIDTH);
  rect(0, 0, CELL_WIDTH);
  pop();
}

