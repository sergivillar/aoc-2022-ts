import { readFile } from "../utils/read-file";

const dir = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const file = readFile(__dirname + "/input.txt");

const trees = file.split("\n").map((i) => i.split(""));

const ROW_START = 1;
const ROW_END = trees.length - 1;
const COL_START = 1;
const COL_END = trees[0].length - 1;

let best = 0;

for (let i = ROW_START; i < ROW_END; i++) {
  for (let j = COL_START; j < COL_END; j++) {
    const tree = trees[i][j];
    let totalTop = 0;
    let totalBottom = 0;
    let totalLeft = 0;
    let totalRight = 0;

    dir.forEach(([x, y]) => {
      if (x === -1 && y === 0) {
        for (let k = i - 1; k >= 0; k--) {
          const otherTree = trees[k][j];
          if (tree > otherTree) {
            totalTop += 1;
          } else {
            totalTop += 1;
            break;
          }
        }
      }

      if (x === 1 && y === 0) {
        for (let k = i + 1; k < trees.length; k++) {
          const otherTree = trees[k][j];
          if (tree > otherTree) {
            totalBottom += 1;
          } else {
            totalBottom += 1;
            break;
          }
        }
      }

      if (x === 0 && y === -1) {
        for (let k = j - 1; k >= 0; k--) {
          const otherTree = trees[i][k];
          if (tree > otherTree) {
            totalLeft += 1;
          } else {
            totalLeft += 1;
            break;
          }
        }
      }

      if (x === 0 && y === 1) {
        for (let k = j + 1; k < trees[0].length; k++) {
          const otherTree = trees[i][k];
          if (tree > otherTree) {
            totalRight += 1;
          } else {
            totalRight += 1;
            break;
          }
        }
      }
    });

    const t = totalTop * totalBottom * totalLeft * totalRight;

    if (!best) {
      best = t;
    } else if (t > best) {
      best = t;
    }
  }
}

console.log("Result -> ", best);
