import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt").split("\n\n");

const areInOrder = (arr1: Array<any>, arr2: Array<any>) => {
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

const result = file.reduce((acc, pair, index) => {
  const [pair1Raw, pair2Raw] = pair.split("\n");
  const pair1 = JSON.parse(pair1Raw);
  const pair2 = JSON.parse(pair2Raw);

  return areInOrder(pair1, pair2) ? (acc += index + 1) : acc;
}, 0);

console.log("Result -> ", result);
