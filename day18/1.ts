import { readFile } from "../utils/read-file";
import Queue from "../utils/queue";

const input = readFile(__dirname + "/input.txt").split("\n");

const cubes = input.map((item) => item);

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

const visited: Array<string> = [];

const findBlock = (cube: string) => {
  const queue = new Queue();
  queue.enqueue([cube, 6]);
  let total = 0;

  while (queue.length) {
    let [cube, value] = queue.deque() as Array<any>;

    if (visited.includes(cube)) continue;
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

const total = cubes.reduce((acc, cube) => acc + findBlock(cube), 0);

console.log("Result -> ", total);
