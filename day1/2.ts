import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt");

const result = file
  ?.split("\n\n")
  .map((i) => i.split("\n"))
  .map((i) => i.reduce((a, b) => Number(a) + Number(b), 0))
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((a, b) => a + b, 0);

console.log("Result -> ", result);
