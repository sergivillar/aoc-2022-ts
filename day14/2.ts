import { readFile } from "../utils/read-file";

const ROCK = "#";
const AIR = ".";
const SOURCE = "+";
const SAND = "o";
const START_SAND = { x: 500, y: 0 };

let yMax = Infinity;

const lines = readFile(__dirname + "/input.txt").split("\n");

const getKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`;

const parseMap = (lines) => {
  const map = {};
  map[getKey(START_SAND)] = SOURCE;

  lines.forEach((line) => {
    const points = line
      .split(" -> ")
      .map((item) => item.split(",").map(Number));

    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1];
      const [x2, y2] = points[i];

      if (x1 === x2) {
        const [yStart, yEnd] = y1 > y2 ? [y2, y1] : [y1, y2];

        for (let i = yStart; i <= yEnd; i++) {
          map[getKey({ x: x1, y: i })] = ROCK;
        }
      } else {
        const [xStart, xEnd] = x1 > x2 ? [x2, x1] : [x1, x2];

        for (let i = xStart; i <= xEnd; i++) {
          map[getKey({ x: i, y: y1 })] = ROCK;
        }
      }
    }
  });

  const ys = Object.entries(map).map((i) => Number(i[0].split(",")[1]));
  yMax = Math.max(...ys) + 2;

  return map;
};

const MAP = parseMap(lines);

const drawMap = () => {
  const xs = Object.entries(MAP).map((i) => Number(i[0].split(",")[0]));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);

  for (let i = START_SAND.y; i <= yMax; i++) {
    let draw = "";
    for (let j = xMin; j <= xMax; j++) {
      const value = MAP[getKey({ x: j, y: i })];
      if (i === yMax) draw += ROCK;
      else draw += value || AIR;
    }
    console.log(draw);
  }
};

const DIRS = [
  [0, 1],
  [-1, 1],
  [1, 1],
];

let previousPoint: { x: number; y: number } | null = null;

const moveDown = (point: { x: number; y: number }) => {
  for (let i = 0; i < DIRS.length; i++) {
    const nextPoint = { x: point.x + DIRS[i][0], y: point.y + DIRS[i][1] };

    const nextValue = nextPoint.y === yMax ? ROCK : MAP[getKey(nextPoint)];

    if (nextValue === ROCK || nextValue === SAND) continue;

    MAP[getKey(nextPoint)] = SAND;
    if (previousPoint && MAP[getKey(previousPoint)] === SAND) {
      MAP[getKey(previousPoint)] = null;
    }

    previousPoint = nextPoint;
    return moveDown(nextPoint);
  }

  if (point.x === START_SAND.x && point.y === START_SAND.y) {
    MAP[getKey(START_SAND)] = SAND;
    return false;
  }

  previousPoint = null;
  return true;
};

let result = 1;
while (moveDown(START_SAND)) {
  result += 1;
}

console.log("Result -> ", result);
