import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt").split("\n");

const getItems = (row: string): Record<number, string> => {
  const matches = row.matchAll(/\[[A-Z]\]/g);
  return [...matches].reduce((acc, curr) => {
    const index = (curr.index ?? -1) / 4;
    return { ...acc, [index]: curr[0] };
  }, {});
};

const getInstructionsIndex = (input: Array<string>) =>
  input.findIndex((item) => item === "");

const getInstructions = (row: string) => {
  const match = [...row.matchAll(/(\d)+/g)];

  if (!match) {
    throw new Error("parsing instruction error");
  }

  return {
    move: Number(match[0][0]),
    from: Number(match[1][0]) - 1,
    to: Number(match[2][0]) - 1,
  };
};

const instrucionIndex = getInstructionsIndex(file);
const instructions = file.slice(instrucionIndex + 1);

const stacks = file.reduce((acc, row) => {
  const items = getItems(row);
  Object.entries(items).forEach(([index, value]) => {
    if (!acc[index]) {
      acc[index] = [];
    }
    acc[index].push(value);
  });

  return acc;
}, [] as Array<Array<string>>);

const result = instructions.reduce(
  (acc, instruction) => {
    const rule = getInstructions(instruction);

    const tmp = acc[rule.from].splice(0, rule.move);
    acc[rule.to].unshift(...tmp);

    return acc;
  },
  [...stacks]
);

const getResult = (input: Array<Array<String>>) => {
  return input.map((i) => i[0].replace(/\[/g, "").replace(/\]/g, "")).join("");
};

console.log("Result -> ", getResult(result));
