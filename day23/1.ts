import { isFunctionDeclaration } from "typescript";
import { readFile } from "../utils/read-file";

const ELF = "#";
const GROUND = ".";

const MOVES_COORDS = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
  NE: [1, -1],
  NW: [-1, -1],
  SE: [1, 1],
  SW: [-1, 1],
};

const MOVES = [
  [MOVES_COORDS.N, MOVES_COORDS.NE, MOVES_COORDS.NW], // N
  [MOVES_COORDS.S, MOVES_COORDS.SE, MOVES_COORDS.SW], // S
  [MOVES_COORDS.W, MOVES_COORDS.NW, MOVES_COORDS.SW], // W
  [MOVES_COORDS.E, MOVES_COORDS.NE, MOVES_COORDS.SE], // E
];

const rawMap = readFile(__dirname + "/input.txt").split("\n");

const getKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`;

const map = rawMap.reduce((acc, lineRaw, row) => {
  const line = lineRaw.split("");
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    acc[getKey({ x: i, y: row })] = char;
  }
  return acc;
}, {});

const draw = () => {
  const coords = Object.keys(map).filter((key) => map[key] === ELF);
  const xs = coords.map((i) => Number(i.split(",")[0]));
  const ys = coords.map((i) => Number(i.split(",")[1]));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);

  for (let i = yMin; i <= yMax; i++) {
    let draw = "";
    for (let j = xMin; j <= xMax; j++) {
      const value = map[getKey({ x: j, y: i })];
      draw += value || GROUND;
    }
    console.log(draw);
  }
};

const countGroundTiles = () => {
  const coords = Object.keys(map).filter((key) => map[key] === ELF);
  const xs = coords.map((i) => Number(i.split(",")[0]));
  const ys = coords.map((i) => Number(i.split(",")[1]));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);

  return (xMax - xMin + 1) * (yMax - yMin + 1) - coords.length;
};

let currentDirection = 0;

for (let turn = 0; turn < 10; turn++) {
  const elfs = Object.entries(map).filter(([, type]) => type === ELF);

  const nextMoves = {};

  for (let i = 0; i < elfs.length; i++) {
    const coords = elfs[i][0];
    const [x, y] = coords.split(",").map(Number);

    // if no neightbors, do not move
    const noNeightborElfs = Object.values(MOVES_COORDS).every(
      ([xOffset, yOffset]) => {
        const nextKey = getKey({ x: x + xOffset, y: y + yOffset });
        return !map[nextKey] || map[nextKey] !== ELF;
      }
    );

    if (noNeightborElfs) continue;

    for (
      let moveTo = currentDirection;
      moveTo <= currentDirection + MOVES.length - 1;
      moveTo++
    ) {
      if (nextMoves[coords]) break;

      const next = moveTo % 4;

      const canMove = MOVES[next].every((direction) => {
        const [xOffset, yOffset] = direction;
        const nextKey = getKey({ x: x + xOffset, y: y + yOffset });
        return !map[nextKey] || map[nextKey] !== ELF;
      });

      if (!canMove) continue;

      nextMoves[coords] = {
        x: x + MOVES[next][0][0],
        y: y + MOVES[next][0][1],
      };
    }
  }
  // console.log(nextMoves);

  const movesCount = Object.values(nextMoves).reduce((acc: any, next: any) => {
    if (!acc[getKey(next)]) return { ...acc, [getKey(next)]: 1 };
    return { ...acc, [getKey(next)]: acc[getKey(next)] + 1 };
  }, {} as Record<string, number>);

  const notMove = Object.entries(movesCount as Record<string, number>)
    .filter(([_, count]) => count > 1)
    .map((item) => item[0]);

  const moves = Object.entries(nextMoves).filter(
    ([_, next]: [string, any]) => !notMove.includes(getKey(next))
  );

  moves.forEach(([current, next]: [string, any]) => {
    map[current] = GROUND;
    map[getKey(next)] = ELF;
  });

  // draw();
  // console.log(moves);
  currentDirection += 1;
}

draw();

console.log("Result -> ", countGroundTiles());
