import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt");

const DIRS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const getHeight = ({ x, y }: { x: number; y: number }) => {
  const value = map[y][x];
  const letter = value === "S" ? "a" : value === "E" ? "z" : value;
  return letter.charCodeAt(0);
};

const map: Array<Array<string>> = file.split("\n").map((i) => i.split(""));
const visited: Array<Array<boolean>> = map.map((col) => col.map(() => false));

const getStartPosition = () => {
  for (let col = 0; col < map.length - 1; col++) {
    const indexCol = map[col].findIndex((item) => item === "S");
    if (indexCol !== -1) {
      return { y: col, x: indexCol };
    }
  }
};

const startPos = getStartPosition();

const getAdjacent = ({
  x,
  y,
}: {
  x: number;
  y: number;
}): Array<{ x: number; y: number }> => {
  // @ts-ignore boolean values already filtered
  return DIRS.map(([xOffset, yOffset]) => {
    const nextX = x + xOffset;
    const nextY = y + yOffset;
    if (
      nextX >= 0 &&
      nextX < map[0].length &&
      nextY >= 0 &&
      nextY < map.length
    ) {
      return { x: nextX, y: nextY };
    }
  }).filter(Boolean);
};

const bfs = () => {
  if (!startPos) throw Error("Start position not found");

  const queue: Array<Array<{ x: number; y: number }>> = [];
  queue.push([startPos]);
  visited[startPos.y][startPos.x] = true;

  while (queue.length) {
    const lastPath = queue.shift();
    if (!lastPath) throw Error("Empty queue");

    const current = lastPath[lastPath.length - 1];
    const currentValue = getHeight(current);

    if (map[current.y][current.x] === "E") {
      return lastPath;
    }

    const adjacents = getAdjacent(current);

    adjacents.forEach((adj) => {
      const adjValue = getHeight(adj);
      if (!visited[adj.y][adj.x] && adjValue <= currentValue + 1) {
        visited[adj.y][adj.x] = true;
        const newPath = [...lastPath, { x: adj.x, y: adj.y }];
        queue.push(newPath);
      }
    });
  }
};

console.log("Result -> ", (bfs()?.length || 0) - 1);
