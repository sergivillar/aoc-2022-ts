import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt").replace(/\n\n/g, "\n");

const areInOrder = (arr1, arr2) => {
  const maxLength = Math.max(arr1.length, arr2.length);

  for (let i = 0; i < maxLength; i++) {
    const item1 = arr1[i];
    const item2 = arr2[i];
    if (item1 === undefined) return true;

    if (item2 === undefined) return false;

    if (Number.isInteger(item1) && Number.isInteger(item2)) {
      if (item1 > item2) {
        return false;
      }

      if (item1 < item2) {
        return true;
      }
      continue;
    }

    if (!Array.isArray(item1)) {
      return areInOrder([item1], item2);
    }

    if (!Array.isArray(item2)) {
      return areInOrder(item1, [item2]);
    }

    const knowsOrder = areInOrder(item1, item2);
    if (knowsOrder !== undefined) return knowsOrder;
  }
};

const package2 = [[2]];
const package6 = [[6]];

const signals = [
  ...file.split("\n").map((i) => JSON.parse(i)),
  package2,
  package6,
].sort((a, b) => (areInOrder(a, b) ? -1 : 1));

const findPackage2 = signals.findIndex((item) => item === package2) + 1;
const findPackage6 = signals.findIndex((item) => item === package6) + 1;

console.log("Result -> ", findPackage2 * findPackage6);
