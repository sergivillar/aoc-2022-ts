import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt");

const isMarkerUnique = (arr: Array<string>) => new Set(arr).size === arr.length;

const getPosition = () => {
  const marker: Array<string> = [];
  for (let i = 0; i < file.length; i++) {
    if (marker.length < 4) {
      marker.push(file[i]);
    } else {
      if (isMarkerUnique(marker)) {
        return i;
      }

      marker.shift();
      marker.push(file[i]);
    }
  }
};

console.log("Result -> ", getPosition());
