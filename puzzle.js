

function hasProblems(data) {
    const covered = new Array(10);
    covered.fill(false);

    for (it of data) {
        if (it !== undefined) {

            if (covered[it]) {
                return true;
            }
            covered[it] = true;
        }
    }
    return false;
}

class Cell {

    data = new Array(9);

    constructor() { 
        this.data.fill(undefined)
    }

    set(x, y, value) {
        if (x >= 0 && x <= 2 && y >= 0 && y <= 2) {
            this.data[y * 3 + x] = value;
        }
    }

    get(x, y) {
        return this.data[y * 3 + x];
    }


    getUnusedNumbers() {
        const numbers = [true, true, true, true, true, true, true, true, true];
        this.data.forEach(it => numbers[it] = false);
        const unused = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        return unused.filter((it, idx) => numbers[idx]);
    }

    hasProblem() {
        return hasProblems(this.data);
    }

    isFull(){
        return this.data.every(it => it !== undefined);
    }
}

class Puzzle {

    cells = [];
    constructor() {
        for (let x = 0; x < 3 * 3; x++) {
            this.cells[x] = new Cell();
        }
    }

    getCell(x, y) {
        const _x = Math.trunc(x / 3);
        const _y = Math.trunc(y / 3);
        return this.cells[_y * 3 + _x];
    }

    get(x, y) {
        return this.getCell(x, y).get(x % 3, y % 3);
    }

    set(x, y, value) {
        return this.getCell(x, y).set(x % 3, y % 3, value);
    }

    isFull(){
        return this.cells.every(c =>
            c.isFull());
    }

    hasProblem() {
        for (let c of this.cells) {
            if (c.hasProblem()) {
                return true;
            }
        }

        for (let r = 0; r < 9; r++) {
            let covered = new Array(10);
            covered.fill(false);
            for (let c = 0; c < 9; c++) {
                const v = this.get(r, c);
                if (v) {
                    if (covered[v]) return true
                    covered[v] = true;
                }
            }
        }

        for (let c = 0; c < 9; c++) {
            let covered = new Array(10);
            covered.fill(false);
            for (let r = 0; r < 9; r++) {
                const v = this.get(r, c);
                if (v) {
                    if (covered[v]) return true
                    covered[v] = true;
                }
            }
        }
        return false;
    }

}

class Solver {
    state = [];
    constructor(puzz) {
        this.puzzle = puzzle;
        this.pushState(0, 0, [1, 2, 3, 4, 5, 6, 7, 8, 9])
    }

    pushState(x, y, numbers) {
        this.state.push({ x, y, numbers });
    }

    popState() {
        this.state.pop();
    }

    getState(){
        return this.state;
    }

    nextEmptyField() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (this.puzzle.get(x, y) == undefined) {
                    return [x, y];
                }
            }
        }
        return [undefined, undefined];
    }

    step() {
        let s = this.state.pop();
        while (s.numbers.length == 0) {
            this.puzzle.set(s.x, s.y, undefined);
            s = this.state.pop();
        }

        this.puzzle.set(s.x, s.y, s.numbers.pop());

        this.state.push(s);

        if (!this.puzzle.hasProblem()) {
            if (this.puzzle.isFull()) {
                return true;
            }

            let [x, y] = this.nextEmptyField();
            if (x !== undefined && y !== undefined) {
                this.pushState(x, y, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }
        }
        return false;
    }


}