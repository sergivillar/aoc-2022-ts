import { readFile } from "../utils/read-file";

const WALL = "#";
const PATH = ".";

const [rawMap, pathRaw] = readFile(__dirname + "/input.txt").split("\n\n");

const path = pathRaw.split(/([RL])/);

const map = rawMap.split("\n").reduce((acc, lineRaw, row) => {
  const line = lineRaw.split("");
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char && char !== " ") {
      acc[`${i + 1}:${row + 1}`] = char;
    }
  }
  return acc;
}, {});

const getFirstCharOfRow = (col: number) => {
  return Math.min(
    ...Object.keys(map)
      .filter((item) => item.endsWith(`:${col}`))
      .map((item) => Number(item.split(":")[0]))
  );
};

const getLastCharOfRow = (col: number) => {
  return Math.max(
    ...Object.keys(map)
      .filter((item) => item.endsWith(`:${col}`))
      .map((item) => Number(item.split(":")[0]))
  );
};

const getFirstCharOfCol = (row: number) => {
  return Math.min(
    ...Object.keys(map)
      .filter((item) => item.startsWith(`${row}:`))
      .map((item) => Number(item.split(":")[1]))
  );
};

const getLastCharOfCol = (row: number) => {
  return Math.max(
    ...Object.keys(map)
      .filter((item) => item.startsWith(`${row}:`))
      .map((item) => Number(item.split(":")[1]))
  );
};

const START_POS: [number, number] = [getFirstCharOfRow(1), 1];
const INITITAL_DIRECTION = 0;

let currentPosition = START_POS;
let currentDirection = INITITAL_DIRECTION;

const getNextCoordinate = (x: number, y: number, direction: number) => {
  if (direction === 0) {
    return [x + 1, y];
  } else if (direction === 1) {
    return [x, y + 1];
  } else if (direction === 2) {
    return [x - 1, y];
  } else {
    return [x, y - 1];
  }
};

const getNextCoordinateInBound = (x: number, y: number, direction: number) => {
  if (direction === 0) {
    const nextX = getFirstCharOfRow(y);
    return [nextX, y];
  } else if (direction === 1) {
    const nextY = getFirstCharOfCol(x);
    return [x, nextY];
  } else if (direction === 2) {
    const nextX = getLastCharOfRow(y);
    return [nextX, y];
  } else {
    const nextY = getLastCharOfCol(x);
    return [x, nextY];
  }
};

const move = (
  [xStart, yStart]: [number, number],
  to: number,
  direction: number
): [number, number] => {
  let xCurrent = Number(xStart);
  let yCurrent = Number(yStart);

  for (let i = 0; i < to; i++) {
    let [xNext, yNext] = getNextCoordinate(xCurrent, yCurrent, direction);

    if (!map[`${xNext}:${yNext}`]) {
      [xNext, yNext] = getNextCoordinateInBound(xNext, yNext, direction);
    }
    if (map[`${xNext}:${yNext}`] === WALL) return [xCurrent, yCurrent];

    xCurrent = xNext;
    yCurrent = yNext;
  }

  return [xCurrent, yCurrent];
};

path.forEach((order) => {
  if (order === "R") {
    currentDirection = (currentDirection + 1) % 4;
  } else if (order === "L") {
    const next = (currentDirection - 1) % 4;
    if (next < 0) {
      currentDirection = 3;
    } else {
      currentDirection = next;
    }
  } else {
    currentPosition = move(currentPosition, Number(order), currentDirection);
  }
});

console.log(
  "Result -> ",
  1000 * currentPosition[1] + 4 * currentPosition[0] + currentDirection
);
