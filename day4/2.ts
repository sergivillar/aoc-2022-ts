import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt");

const pairs = file.split("\n").map((item) => item.split(","));

const result = pairs.reduce((acc, [pair1, pair2]) => {
  const [pair1Start, pair1End] = pair1.split("-").map(Number);
  const [pair2Start, pair2End] = pair2.split("-").map(Number);

  // [5-7], [6-7]
  if (pair1End >= pair2Start && pair2End >= pair1Start) {
    return acc + 1;
  }

  return acc;
}, 0);

console.log("Result -> ", result);
