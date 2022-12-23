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
const elfsMap = {};

const getKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`;

const map = rawMap.reduce((acc, lineRaw, row) => {
  const line = lineRaw.split("");
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    acc[getKey({ x: i, y: row })] = char;
    if (char === ELF) {
      elfsMap[getKey({ x: i, y: row })] = ELF;
    }
  }
  return acc;
}, {});

let currentDirection = 0;

let keepGoing = true;
let turn = 0;

while (keepGoing) {
  turn++;
  const elfs = Object.entries(elfsMap);
  let noElfesMoves = false;

  const nextMoves: Record<string, { x: number; y: number }> = {};

  for (let i = 0; i < elfs.length; i++) {
    const coords = elfs[i][0];
    const [x, y] = coords.split(",").map(Number);

    const hasElfNeighbors = Object.values(MOVES_COORDS).some(
      ([xOffset, yOffset]) => {
        const nextKey = getKey({ x: x + xOffset, y: y + yOffset });
        return map[nextKey] && map[nextKey] === ELF;
      }
    );

    if (!hasElfNeighbors) continue;

    noElfesMoves = true;

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

  if (!noElfesMoves) {
    keepGoing = false;
    console.log("Result ->", turn);
    break;
  }

  noElfesMoves = false;

  const nextMovesEntries = Object.entries(nextMoves);

  const moves: Record<string, number> = {};
  const duplicated: Record<string, number> = {};

  for (let i = 0; i < nextMovesEntries.length; i++) {
    const [_, next] = nextMovesEntries[i];
    const nextKey = getKey(next);

    if (moves[nextKey] === 1) {
      duplicated[nextKey] = 1;
    }
    moves[nextKey] = 1;
  }

  Object.entries(nextMoves).forEach(([current, next]) => {
    if (!duplicated[getKey(next)]) {
      map[current] = GROUND;
      map[getKey(next)] = ELF;
      delete elfsMap[current];
      elfsMap[getKey(next)] = ELF;
    }
  });

  currentDirection += 1;
}
