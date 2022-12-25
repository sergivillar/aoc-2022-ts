import { readFile } from "../utils/read-file";
import Queue from "../utils/queue";

const file = readFile(__dirname + "/input.txt").split("\n");

type Point = { x: number; y: number };

const GROUND = ".";
const WALL = "#";
const BLIZZARDS: [[string, Point]?] = [];

const DIRECTIONS = [
  [0, 1], // S
  [1, 0], // E
  [-1, 0], // W
  [0, -1], // N
];

const BLIZZARD_DIRECTION = {
  v: DIRECTIONS[0],
  ">": DIRECTIONS[1],
  "<": DIRECTIONS[2],
  "^": DIRECTIONS[3],
};
const getKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`;

const map = file.reduce((acc, lineRaw, row) => {
  const line = lineRaw.split("");
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    acc[getKey({ x: i, y: row })] = char;

    if (char !== WALL && char !== GROUND) {
      BLIZZARDS.push([char, { x: i, y: row }]);
    }
  }
  return acc;
}, {});

const coords = Object.keys(map);
const xs = coords.map((i) => Number(i.split(",")[0]));
const ys = coords.map((i) => Number(i.split(",")[1]));
const xMax = Math.max(...xs);
const yMax = Math.max(...ys);

const START_POS = { x: 1, y: 0 };
const END_POSITION = { x: xMax - 1, y: yMax };

const blizzardsCache = {};

const moveBlizzards = (blizzards, minute) => {
  if (blizzardsCache[String(minute)]) {
    return blizzardsCache[String(minute)];
  }

  const newBlizzards: Array<[string, Point]> = [];

  for (let i = 0; i < blizzards.length; i++) {
    const [direction, currentPosition] = blizzards[i];
    const [xOffset, yOffset] = BLIZZARD_DIRECTION[direction];

    let next = {
      x: currentPosition.x + xOffset,
      y: currentPosition.y + yOffset,
    };

    if (next.x === 0 || next.x === xMax || next.y === 0 || next.y === yMax) {
      if (direction === "^") {
        next = { x: currentPosition.x, y: yMax - 1 };
      } else if (direction === "v") {
        next = { x: currentPosition.x, y: 1 };
      } else if (direction === ">") {
        next = { x: 1, y: currentPosition.y };
      } else if (direction === "<") {
        next = { x: xMax - 1, y: currentPosition.y };
      }
    }

    newBlizzards[i] = [direction, next];
  }

  blizzardsCache[String(minute)] = newBlizzards;

  return newBlizzards;
};

const findPath = (startPos: Point, blizzards, map) => {
  const queue = new Queue();
  const visited = {};

  queue.enqueue([startPos, blizzards, 0]);

  while (queue.length) {
    const [current, blizzards, minute] = queue.deque() as [
      Point,
      [number, number],
      number
    ];

    const newBlizzards = moveBlizzards(blizzards, minute);
    const blizzardsPos = newBlizzards.map(([direction, position]) =>
      getKey(position)
    );
    const nextTime = minute + 1;

    for (let i = 0; i < DIRECTIONS.length; i++) {
      const [xOffset, yOffset] = DIRECTIONS[i];
      const next = {
        x: current.x + xOffset,
        y: current.y + yOffset,
      };
      if (next.x === END_POSITION.x && next.y === END_POSITION.y) {
        console.log("Result ->", nextTime);
        return;
      }

      if (next.x === START_POS.x && next.y === START_POS.y) continue;

      if (next.x < 1 || next.x >= xMax) continue;
      if (next.y < 1 || next.y >= yMax) continue;

      if (
        (next.x !== START_POS.x || next.y !== START_POS.y) &&
        !blizzardsPos.includes(getKey(next)) &&
        !visited[`${getKey(next)}-${nextTime}`]
      ) {
        visited[`${getKey(next)}-${nextTime}`] = 1;
        queue.enqueue([next, newBlizzards, nextTime]);
      }
    }

    if (
      !blizzardsPos.includes(getKey(current)) &&
      !visited[`${getKey(current)}-${nextTime}`]
    ) {
      visited[`${getKey(current)}-${nextTime}`] = 1;
      queue.enqueue([current, newBlizzards, nextTime]);
    }
  }
};

findPath(START_POS, BLIZZARDS, map);

console.log("Result -> ");
