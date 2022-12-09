import { readFile } from "../utils/read-file";

const input = readFile(__dirname + "/input.txt");

const normalice = (item: string) => {
  if (item === "X") return "A";
  if (item === "Y") return "B";
  if (item === "Z") return "C";
};

const getShapePoints = (shape: string) => {
  if (shape === "A") return 1;
  if (shape === "B") return 2;
  if (shape === "C") return 3;

  return 0;
};

const getMatchPoints = (elf: string, me: string) => {
  if (elf === me) return 3;

  if (elf === "A" && me === "B") return 6;
  if (elf === "B" && me === "C") return 6;
  if (elf === "C" && me === "A") return 6;

  return 0;
};

const result = input.split("\n").reduce((acc, item) => {
  const [elf, rawMe] = item.split(" ");
  const me = normalice(rawMe);

  if (!me) return acc;

  return acc + getMatchPoints(elf, me) + getShapePoints(me);
}, 0);

console.log("Result -> ", result);
