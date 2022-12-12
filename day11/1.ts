import { readFile } from "../utils/read-file";

const monkeysRaw = readFile(__dirname + "/input.txt").split("\n\n");

const DIVIDE_BY = 3;
const ROUNDS = 20;

const calc = (s: string) => Function(`return(${s})`)();

const parseMonkey = (input: string) => {
  const monkey = input.split("\n");
  const items = monkey[1]
    .split(":")[1]
    .split(",")
    .map((item) => Number(item.trim()));

  const operation = monkey[2].split(" = ")[1];

  const divisible = Number(monkey[3].split("divisible by")[1].trim());

  const ifTrue = Number(monkey[4].charAt(monkey[4].length - 1));
  const ifFalse = Number(monkey[5].charAt(monkey[5].length - 1));

  return { items, operation, divisible, ifTrue, ifFalse, inspectedItems: 0 };
};

const monkeys: Array<{
  items: Array<number>;
  operation: string;
  divisible: number;
  ifTrue: number;
  ifFalse: number;
  inspectedItems: number;
}> = [];

monkeysRaw.forEach((monkeyRaw) => {
  monkeys.push(parseMonkey(monkeyRaw));
});

Array.from({ length: ROUNDS }, () => {
  monkeys.forEach((monkey) => {
    monkey.items.forEach((item) => {
      monkey.inspectedItems++;
      const operation = monkey.operation.replace(/old/g, String(item));

      const result = calc(operation);
      const dividedBy = parseInt(String(result / DIVIDE_BY));

      if (dividedBy % monkey.divisible === 0) {
        monkeys[monkey.ifTrue].items.push(dividedBy);
      } else {
        monkeys[monkey.ifFalse].items.push(dividedBy);
      }
    });
    monkey.items = [];
  });
});

const result = monkeys
  .sort((a, b) => b.inspectedItems - a.inspectedItems)
  .slice(0, 2)
  .reduce((acc, current) => acc * current.inspectedItems, 1);

console.log("Result -> ", result);
