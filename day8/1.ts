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

let initialTrees = trees.length * 2 + (trees[0].length - 2) * 2;
let total = initialTrees;

for (let i = ROW_START; i < ROW_END; i++) {
  for (let j = COL_START; j < COL_END; j++) {
    const tree = trees[i][j];

    const isVisible = dir.some(([x, y]) => {
      if (x === -1 && y === 0) {
        for (let k = 0; k < i; k++) {
          const otherTree = trees[k][j];
          if (tree <= otherTree) {
            return false;
          }
        }
      }

      if (x === 1 && y === 0) {
        for (let k = i + 1; k < trees.length; k++) {
          const otherTree = trees[k][j];
          if (tree <= otherTree) {
            return false;
          }
        }
      }

      if (x === 0 && y === -1) {
        for (let k = 0; k < j; k++) {
          const otherTree = trees[i][k];
          if (tree <= otherTree) {
            return false;
          }
        }
      }

      if (x === 0 && y === 1) {
        for (let k = j + 1; k < trees[0].length; k++) {
          const otherTree = trees[i][k];
          if (tree <= otherTree) {
            return false;
          }
        }
      }

      return true;
    });

    if (isVisible) {
      total += 1;
    }
  }
}

console.log("Result -> ", total);
