import { readFile } from "../utils/read-file";

const NUM_KNOTS = 10;

const DIRS = [
  [0, 0],
  [1, 0],
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [1, 1],
];

const MOVE = {
  R: { x: 1, y: 0 },
  L: { x: -1, y: 0 },
  U: { x: 0, y: 1 },
  D: { x: 0, y: -1 },
};

const instructions = readFile(__dirname + "/input.txt").split("\n");

const start = { x: 0, y: 0 };
const knots = Array.from({ length: NUM_KNOTS }, () => [start]);

const areKnotsClose = (knotIndex: number) => {
  const head = knots[knotIndex - 1][knots[knotIndex - 1].length - 1];
  const knot = knots[knotIndex][knots[knotIndex].length - 1];

  return DIRS.some(([x, y]) => head.x === knot.x + x && head.y === knot.y + y);
};

const moveHead = (direction) => {
  const { x, y } = MOVE[direction];
  knots[0].push({
    x: knots[0][knots[0].length - 1].x + x,
    y: knots[0][knots[0].length - 1].y + y,
  });
};

const moveKnot = (index: number) => {
  const areClose = areKnotsClose(index);
  if (areClose) return;

  const head = knots[index - 1][knots[index - 1].length - 1];
  const current = knots[index][knots[index].length - 1];

  const offSetX = head.x > current.x ? 1 : -1;
  const offSetY = head.y > current.y ? 1 : -1;

  if (current.y === head.y) {
    knots[index].push({
      x: current.x + offSetX,
      y: current.y,
    });
  } else if (current.x === head.x) {
    knots[index].push({
      x: current.x,
      y: current.y + offSetY,
    });
  } else {
    knots[index].push({
      x: current.x + offSetX,
      y: current.y + offSetY,
    });
  }
};

instructions.forEach((command) => {
  const [direction, distance] = command.split(" ");

  [...Array(Number(distance)).keys()].forEach(() => {
    moveHead(direction);

    Array.from({ length: NUM_KNOTS - 1 }, (_, index) => {
      moveKnot(index + 1);
    });
  });
});

const getResult = () =>
  Object.keys(
    knots[knots.length - 1].reduce((acc, current) => {
      acc[`${current.x},${current.y}`] = 0;
      return acc;
    }, {})
  ).length;

console.log("Result -> ", getResult());
