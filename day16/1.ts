import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt").split("\n");

const SOURCE = "AA";
const MINUTES = 30;

const REG_EXP =
  /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (\w+(?:, \w+)*)/;

const data = file.reduce(
  (acc, curr) => {
    const match = curr.match(REG_EXP);
    if (!match) throw Error("Error parsing");

    const [_, origin, rate, destinationsRaw] = match;
    const destinations = destinationsRaw.split(", ");

    return {
      ...acc,
      [origin]: { rate: Number(rate), children: destinations },
      distances: {
        ...acc.distances,
        [origin]: destinations.reduce((a, v) => ({ ...a, [v]: 1 }), {}),
      },
    };
  },
  { distances: {} }
);

const simplify = (
  start: string,
  distances: { [node: string]: { [node: string]: number } }
) => {
  const queue = [start];
  const seen = [start];

  while (queue.length !== 0) {
    let current = queue.shift() as string;

    if (current !== SOURCE && data[current].rate === 0) {
      const [start, end] = Object.keys(distances[current]);

      const nextDist =
        Math.max(distances[start][current], distances[end][current]) + 1;

      distances[start][end] = nextDist;
      distances[end][start] = nextDist;

      delete distances[start][current];
      delete distances[end][current];
      delete distances[current];
    }

    for (let i = 0; i < data[current].children.length; i++) {
      const node = data[current].children[i];
      if (!seen.includes(node)) {
        queue.push(node);
        seen.push(node);
      }
    }
  }

  return distances;
};

const graph = simplify(SOURCE, data.distances);
const cache = {};

const getKey = (current: string, opened: Array<string>, minLeft: number) =>
  `${current}-${opened.toString()}-${minLeft}`;

const backtracking = (
  current: string,
  opened: Array<string>,
  minLeft: number
) => {
  if (cache[getKey(current, opened, minLeft)]) {
    return cache[getKey(current, opened, minLeft)];
  }

  if (minLeft <= 0) {
    cache[getKey(current, opened, minLeft)] = 0;
    return 0;
  }

  let best = 0;
  const node = graph[current];
  const children = Object.keys(node);
  const val = (minLeft - 1) * data[current].rate;

  for (let i = 0; i < children.length; i++) {
    const nextNode = children[i];
    const nextTimeLeft = minLeft - node[nextNode];

    if (!opened.includes(current) && val !== 0) {
      best = Math.max(
        best,
        val + backtracking(nextNode, [...opened, current], nextTimeLeft - 1)
      );
    }
    best = Math.max(best, backtracking(nextNode, opened, nextTimeLeft));
  }

  cache[getKey(current, opened, minLeft)] = best;
  return best;
};

const result = backtracking(SOURCE, [], MINUTES);

console.log("Result -> ", result);
