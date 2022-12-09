import { readFile } from "../utils/read-file";

const rucksacks = readFile(__dirname + "/input.txt").split("\n");

const getLetterValue = (letter: string): number =>
  letter === letter.toLowerCase()
    ? letter.charCodeAt(0) - 97 + 1
    : letter.charCodeAt(0) - 65 + 27;

const result = rucksacks.reduce((acc, rucksack) => {
  const middle = rucksack.length / 2;
  const firstHalf = rucksack.split("").slice(0, middle);
  const secondHalf = rucksack.split("").slice(middle);

  const commonItem = firstHalf.find((item1) =>
    secondHalf.find((item2) => item1 === item2)
  );

  if (!commonItem) return acc;

  return acc + getLetterValue(commonItem);
}, 0);

console.log("Result -> ", result);
