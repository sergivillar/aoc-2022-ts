import { createNoSubstitutionTemplateLiteral } from "typescript";
import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt").split("\n");

type Node<T> = {
  value: T;
  next?: Node<T>;
};

class Queue<T> {
  public length: number;
  private head: Node<T> | undefined;
  private tail: Node<T> | undefined;

  constructor() {
    this.head = this.tail = undefined;
    this.length = 0;
  }

  enqueue(item: T): void {
    this.length++;
    const node = { value: item };

    if (!this.tail) {
      this.tail = this.head = node;
      return;
    }
    this.tail.next = node;
    this.tail = node;
  }

  deque(): T | undefined {
    if (!this.head) return undefined;

    this.length--;
    const head = this.head;
    this.head = this.head.next;

    if (this.length === 0) {
      this.tail = undefined;
    }

    return head.value;
  }

  peek(): T | undefined {
    return this.head?.value;
  }
}

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
    // For existing edges assign the dist to be same as weight
    edges.forEach((e) => (dist[valve][e] = graph[valve][e]));

    valves.forEach((n) => {
      // For all other nodes assign it to infinity
      if (dist[valve][n] == undefined) dist[valve][n] = Infinity;
      // For self edge assign dist to be 0
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

const indexes = Object.keys(graph).reduce((acc, curr, index) => {
  return { ...acc, [curr]: index };
}, {});

const traverse = () => {
  const pathes = new Map();

  const seen = Array(Object.keys(graph).length).fill(0);
  const queue = new Queue();
  queue.enqueue(["AA", 0, MINUTES, seen]);

  while (queue.length) {
    const [position, accumulatedFlow, time, visited] =
      queue.deque() as Array<any>;

    const neighbors = Object.keys(distances[position]);
    const next: Array<any> = [];
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (!visited[indexes[neighbor]] && distances[position][neighbor] < time) {
        next.push(neighbor);
      }
    }

    const key = parseInt(visited.join(""), 2);
    const path = pathes.get(key);
    if (!path || path < accumulatedFlow) {
      pathes.set(key, accumulatedFlow);
    }

    next.forEach((neighbor) => {
      const distance = distances[position][neighbor];
      const nextTimeLeft = time - distance - 1;
      const newFlow = nextTimeLeft * data[neighbor].rate;

      const newVisited = [...visited];
      newVisited[indexes[neighbor]] = 1;
      queue.enqueue([
        neighbor,
        accumulatedFlow + newFlow,
        nextTimeLeft,
        newVisited,
      ]);
    });
  }

  return pathes;
};

const result = traverse();

let max = 0;

for (let [path1, flow1] of result) {
  for (let [path2, flow2] of result) {
    if (!(path1 & path2)) {
      if (flow1 + flow2 > max) max = flow1 + flow2;
    }
  }
}

console.log("Result -> ", max);
