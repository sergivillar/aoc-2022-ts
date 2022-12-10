import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt").split("\n");

const WIDE = 40;
const HIGH = 6;
const LIT = "#";
const DARK = ".";

const CRT: Array<Array<string | null>> = Array.from({ length: HIGH }, () =>
  Array.from({ length: WIDE }, () => null)
);

let cycleCount = 0;
let spritePosition = 1;

const draw = () => {
  const tmp = cycleCount - 1;
  const col = tmp % WIDE;
  const row = parseInt(String(tmp / WIDE));

  const draw =
    col >= spritePosition - 1 && col <= spritePosition + 1 ? LIT : DARK;

  CRT[row][col] = draw;
};

file.forEach((line) => {
  cycleCount += 1;
  draw();

  if (line !== "noop") {
    const value = line.split(" ")[1] ?? 0;
    cycleCount += 1;
    draw();
    spritePosition += Number(value);
  }
});

CRT.forEach((line) => {
  console.log(line.map((i) => i).join(""));
});
