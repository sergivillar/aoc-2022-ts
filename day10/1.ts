import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt").split("\n");

let cycleCount = 0;
let x = 1;
let total = 0;

const FREQUENCIES = [20, 60, 100, 140, 180, 220];

const checkIterarion = () => {
  if (FREQUENCIES.includes(cycleCount)) {
    total += x * cycleCount;
  }
};

file.forEach((line) => {
  cycleCount += 1;
  checkIterarion();

  if (line !== "noop") {
    const value = line.split(" ")[1] ?? 0;
    cycleCount += 1;
    checkIterarion();
    x += Number(value);
  }
});

console.log("Result -> ", total);
