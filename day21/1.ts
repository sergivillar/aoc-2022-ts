import { readFile } from "../utils/read-file";
import Queue from "../utils/queue";

const file = readFile(__dirname + "/input.txt").split("\n");

const isNumber = (input: string) => !isNaN(parseInt(input));
const getOperation = (input: string) => {
  const match = input.match(/(.+)\s([\+\-\*\/])\s(.+)/);
  if (!match) throw Error("error parsing");

  return [match[1], match[2], match[3]];
};
const calc = (s: string) => Function(`return(${s})`)();

const monkeysMap = {};
const toVisit = new Queue();

file.map((monkey) => {
  const [name, operation] = monkey.split(": ");

  if (isNumber(operation)) {
    monkeysMap[name] = Number(operation);
  } else {
    monkeysMap[name] = operation;
  }
  toVisit.enqueue(name);
});

while (toVisit.length) {
  const name = toVisit.deque() as string;

  if (isNumber(monkeysMap[name])) continue;

  const [oper1, symbol, oper2] = getOperation(monkeysMap[name]);

  if (isNumber(monkeysMap[oper1]) && isNumber(monkeysMap[oper2])) {
    monkeysMap[name] = calc(
      `${monkeysMap[oper1]} ${symbol} ${monkeysMap[oper2]}`
    );
  } else {
    toVisit.enqueue(name);
  }
}

console.log("Result -> ", monkeysMap["root"]);
