import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt").split("\n");

const SOURCE = "AA";
const MINUTES = 26;

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

const floydWarshall = (graph: Record<string, Record<string, number>>) => {
  const dist = {};
  const valves = Object.keys(graph);

  for (let i = 0; i < valves.length; i++) {
    const valve = valves[i];
    const edges = Object.keys(graph[valve]);
    dist[valve] = {};
    edges.forEach((e) => (dist[valve][e] = graph[valve][e]));

    valves.forEach((n) => {
      if (dist[valve][n] == undefined) dist[valve][n] = Infinity;
      if (valve === n) dist[valve][n] = 0;
    });
  }

  valves.forEach((i) => {
    valves.forEach((j) => {
      valves.forEach((k) => {
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
      });
    });
  });

  return dist;
};

const graph = simplify(SOURCE, data.distances);
const distances = floydWarshall(graph);

function search(current, toOpen, minLeft, path) {
  const paths: Array<any> = [];

  for (let i = 0; i < toOpen.length; i++) {
    const valveToOpen = toOpen[i];

    const distance = distances[current][valveToOpen];
    if (distance >= minLeft) {
      continue;
    }

    const nextTimeLeft = minLeft - distance - 1;
    const flow = nextTimeLeft * data[valveToOpen].rate;

    const nextToOpen = toOpen.filter((i) => i !== valveToOpen);

    const nextPath = [...path];
    nextPath.push(valveToOpen);

    const fullPath = search(valveToOpen, nextToOpen, nextTimeLeft, nextPath);
    paths.push({
      path: path.concat(fullPath.path),
      flow: fullPath.flow + flow,
    });
  }

  let bestPath = { path: [], flow: 0 };
  paths.forEach((path) => {
    if (path.flow > bestPath.flow) {
      bestPath = path;
    }
  });

  return bestPath;
}

const result = search(
  SOURCE,
  Object.keys(graph).filter((i) => i !== SOURCE),
  MINUTES,
  [SOURCE]
);

console.log("Result -> ", result.flow);
