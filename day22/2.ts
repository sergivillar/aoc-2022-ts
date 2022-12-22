import { readFile } from "../utils/read-file";

const WALL = "#";

const FACES = {
  A: { x: [51, 100], y: [1, 50] },
  B: { x: [100, 150], y: [1, 50] },
  C: { x: [51, 100], y: [51, 100] },
  D: { x: [51, 100], y: [101, 150] },
  E: { x: [1, 50], y: [101, 150] },
  F: { x: [1, 50], y: [151, 200] },
};

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

const getCurrentFace = (x: number, y: number) => {
  const faces = Object.keys(FACES);

  return faces.find((face) => {
    const coords = FACES[face];
    if (
      x >= coords.x[0] &&
      x <= coords.x[1] &&
      y >= coords.y[0] &&
      y <= coords.y[1]
    ) {
      return true;
    }
  });
};

const getNextCoordinateInBound = (
  x: number,
  y: number,
  direction: number
): [number, number, number] => {
  const face = getCurrentFace(x, y);

  if (face === "A" && direction === 3) {
    // move to F
    return [1, 150 + (x - 50), 0]; //
  } else if (face === "A" && direction === 2) {
    // move to E
    return [1, 151 - y, 0]; //
  } else if (face === "B" && direction === 0) {
    // move to D
    return [100, 151 - y, 2]; //
  } else if (face === "B" && direction === 1) {
    // move to C
    return [100, 50 + (x - 100), 2]; //
  } else if (face === "B" && direction === 3) {
    // move to F
    return [x - 100, 200, 3]; //
  } else if (face === "C" && direction === 0) {
    // move to B
    return [100 + (y - 50), 50, 3]; //
  } else if (face === "C" && direction === 2) {
    // move to E
    return [y - 50, 101, 1]; //
  } else if (face === "D" && direction === 0) {
    // move to B
    return [150, 51 - (y - 100), 2]; //
  } else if (face === "D" && direction === 1) {
    // move to F
    return [50, 150 + (x - 50), 2]; //
  } else if (face === "E" && direction === 2) {
    // move to A
    return [51, 51 - (y - 100), 0]; //
  } else if (face === "E" && direction === 3) {
    // move to C
    return [51, 50 + (x + 0), 0]; //
  } else if (face === "F" && direction === 0) {
    // move to D
    return [50 + (y - 150), 150, 3]; //
  } else if (face === "F" && direction === 1) {
    // move to B
    return [100 + x, 1, 1]; //
  } else if (face === "F" && direction === 2) {
    // move to A
    return [50 + (y - 150), 1, 1];
  }

  return [-1, -1, -1];
};

const move = (
  [xStart, yStart]: [number, number],
  to: number,
  direction: number
): [number, number, number] => {
  let currentDirection = direction;
  let xCurrent = Number(xStart);
  let yCurrent = Number(yStart);

  for (let i = 0; i < to; i++) {
    let [xNext, yNext] = getNextCoordinate(
      xCurrent,
      yCurrent,
      currentDirection
    );
    let changeDirection = currentDirection;

    // console.log({ xNext, yNext, currentDirection });

    if (!map[`${xNext}:${yNext}`]) {
      [xNext, yNext, changeDirection] = getNextCoordinateInBound(
        xCurrent,
        yCurrent,
        direction
      );
    }
    if (map[`${xNext}:${yNext}`] === WALL) {
      return [xCurrent, yCurrent, currentDirection];
    }

    xCurrent = xNext;
    yCurrent = yNext;
    currentDirection = changeDirection;
  }

  return [xCurrent, yCurrent, currentDirection];
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
    const data = move(currentPosition, Number(order), currentDirection);
    currentPosition = [data[0], data[1]];
    currentDirection = data[2];
  }
});

console.log(
  "Result -> ",
  1000 * currentPosition[1] + 4 * currentPosition[0] + currentDirection
);
