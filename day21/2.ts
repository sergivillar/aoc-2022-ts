import { readFile } from "../utils/read-file";
import Queue from "../utils/queue";

const file = readFile(__dirname + "/input.txt").split("\n");

const isNumber = (input: string) =>
  !isNaN(parseInt(input)) ||
  Number(input) === Infinity ||
  Number(input) === -Infinity;
const getOperation = (input: string) => {
  const match = input.match(/(.+)\s([\+\-\*\/])\s(.+)/);
  if (!match) {
    throw Error("error parsing ");
  }

  return [match[1], match[2], match[3]];
};

const monkeysMap = {};
const toVisit = new Queue();

file.map((monkey) => {
  const [name, operation] = monkey.split(": ");

  if (name === "root") {
    monkeysMap["root1"] = operation.split(" = ")[0] + " + zero";
    monkeysMap["root2"] = operation.split(" = ")[1] + " + zero";
    monkeysMap["zero"] = 0;
    toVisit.enqueue("root1");
    toVisit.enqueue("root2");
  } else if (name === "humn") {
    monkeysMap["humn"] = Infinity;
  } else {
    if (isNumber(operation)) {
      monkeysMap[name] = Number(operation);
    } else {
      monkeysMap[name] = operation;
    }
    toVisit.enqueue(name);
  }
});

const solve = (monkeys, toVisit, human: number) => {
  monkeys["humn"] = human;
  while (toVisit.length) {
    const name = toVisit.deque() as string;

    if (isNumber(monkeys[name])) continue;

    const [oper1, symbol, oper2] = getOperation(monkeys[name]);

    if (isNumber(monkeys[oper1]) && isNumber(monkeys[oper2])) {
      monkeys[name] = eval(`${monkeys[oper1]} ${symbol} ${monkeys[oper2]}`);
    } else {
      toVisit.enqueue(name);
    }
  }
  return monkeys;
};

const cloneQueue = (oldQueue) => {
  const clone = new Queue();
  const oldLength = oldQueue.length;

  for (let i = 0; i < oldLength; i++) {
    const item = oldQueue.deque();
    clone.enqueue(item);
    oldQueue.enqueue(item);
  }

  return clone;
};

let low = 0;
let high = 10000000000000;
while (true) {
  const middle = Math.floor((high + low) / 2);
  const toVisitQueue = cloneQueue(toVisit);
  const response = solve(
    JSON.parse(JSON.stringify(monkeysMap)),
    toVisitQueue,
    middle
  );

  if (response["root1"] === response["root2"]) {
    console.log("Result -> ", middle);
    break;
  }

  if (response["root1"] > response["root2"]) {
    low = middle;
  } else {
    high = middle;
  }
}
