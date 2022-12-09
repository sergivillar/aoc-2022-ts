import { readFile } from "../utils/read-file";

const rucksacks = readFile(__dirname + "/input.txt").split("\n");

const getLetterValue = (letter: string): number =>
  letter === letter.toLowerCase()
    ? letter.charCodeAt(0) - 97 + 1
    : letter.charCodeAt(0) - 65 + 27;

const chunkArrayInGroups = (arr: Array<string>) => {
  const result: Array<Array<String>> = [];
  for (let i = 0; i < arr.length; i += 3) {
    result.push(arr.slice(i, i + 3));
  }
  return result;
};

const groups = chunkArrayInGroups(rucksacks);

const result = groups.reduce((acc, group) => {
  const commonItem = group[0]
    .split("")
    .find((item1) =>
      group[1]
        .split("")
        .find((item2) =>
          group[2].split("").find((item3) => item1 === item2 && item1 == item3)
        )
    );

  if (!commonItem) return acc;

  return acc + getLetterValue(commonItem);
}, 0);

console.log("Result -> ", result);
