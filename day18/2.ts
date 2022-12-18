import { readFile } from "../utils/read-file";
import Queue from "../utils/queue";

const input = readFile(__dirname + "/input.txt").split("\n");

const MAX_VALUE = 20;

const cubes = input.map((item) => item);

const getSurfaceCube = () => {
  let surfaceCubes: Array<string> = [];
  for (let x = 0; x <= MAX_VALUE + 1; x++) {
    for (let y = 0; y <= MAX_VALUE + 1; y++) {
      for (let z = 0; z <= MAX_VALUE + 1; z++) {
        if (
          x === 0 ||
          x === MAX_VALUE + 1 ||
          y === 0 ||
          y === MAX_VALUE + 1 ||
          z === 0 ||
          z === MAX_VALUE + 1
        ) {
          surfaceCubes.push(`${x},${y},${z}`);
        }
      }
    }
  }
  return surfaceCubes;
};

const getWholeCube = () => {
  const totalCubes = {};
  for (let i = 1; i <= MAX_VALUE; i++) {
    for (let j = 1; j <= MAX_VALUE; j++) {
      for (let k = 1; k <= MAX_VALUE; k++) {
        totalCubes[`${i},${j},${k}`] = 0;
      }
    }
  }
  return totalCubes;
};

const isInBounds = (input) => {
  const [x, y, z] = input.split(",").map((i) => Number(i));
  return (
    x >= 1 &&
    x <= MAX_VALUE &&
    y >= 1 &&
    y <= MAX_VALUE &&
    z >= 1 &&
    z <= MAX_VALUE
  );
};

const getNeighbors = (input: string) => {
  const [x, y, z] = input.split(",").map((i) => Number(i));

  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ].map((item) => item.join(","));
};

let totalCubesDict = getWholeCube();
let surfaceCubes: Array<string> = getSurfaceCube();

const visited: Array<string> = [];
const countBlocks = (cube: string) => {
  const queue = new Queue();
  queue.enqueue([cube, 6]);
  let total = 0;

  while (queue.length) {
    let [cube, value] = queue.deque() as Array<any>;

    if (visited.includes(cube)) continue;
    totalCubesDict[cube] = 1;
    visited.push(cube);

    const neighbors = getNeighbors(cube);

    for (let j = 0; j < neighbors.length; j++) {
      const neighbor = neighbors[j];
      if (visited.includes(neighbor)) {
        value -= 1;
        continue;
      }
      if (cubes.includes(neighbor)) {
        value -= 1;
        queue.enqueue([neighbor, 6]);
      }
    }
    total += value;
  }

  return total;
};

const surfaceVisited: Array<string> = [];

const removeSurfaceBlocks = (cube: string) => {
  const queue = new Queue();
  queue.enqueue(cube);

  while (queue.length) {
    const cube = queue.deque() as string;

    if (surfaceVisited.includes(cube)) continue;

    totalCubesDict[cube] = 1;
    surfaceVisited.push(cube);

    const neighbors = getNeighbors(cube);

    for (let j = 0; j < neighbors.length; j++) {
      const neighbor = neighbors[j];

      if (!isInBounds(neighbor)) continue;

      if (!cubes.includes(neighbor)) {
        queue.enqueue(neighbor);
      }
    }
  }

  return;
};

const total = cubes.reduce((acc, cube) => acc + countBlocks(cube), 0);

surfaceCubes.forEach((cube) => removeSurfaceBlocks(cube));

const visitedAir: Array<string> = [];
const countAir = (cube: string) => {
  const queue = new Queue();
  queue.enqueue([cube, 6]);
  let total = 0;

  while (queue.length) {
    let [cube, value] = queue.deque() as Array<any>;

    if (visitedAir.includes(cube)) continue;

    visitedAir.push(cube);
    const neighbors = getNeighbors(cube);

    for (let j = 0; j < neighbors.length; j++) {
      const neighbor = neighbors[j];
      if (visitedAir.includes(neighbor)) {
        value -= 1;
        continue;
      }
      if (!cubes.includes(neighbor)) {
        value -= 1;
        queue.enqueue([neighbor, 6]);
      }
    }
    total += value;
  }

  return total;
};

const totalCubesNotSeenYet = Object.entries(totalCubesDict)
  .filter(([_, seen]) => !seen)
  .map(([key]) => key);

const air = totalCubesNotSeenYet.reduce((acc, cube) => acc + countAir(cube), 0);

console.log("Result -> ", total - air);
