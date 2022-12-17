import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt");

const START_MOVES = 3;
const ROCKS = [
  ["  #### "],
  ["   #   ", "  ###  ", "   #   "],
  ["    #  ", "    #  ", "  ###  "],
  ["  #    ", "  #    ", "  #    ", "  #    "],
  ["  ##   ", "  ##   "],
].map((rock) =>
  rock.map(([...bits]) =>
    bits
      .map((b, i) => (b === "#" ? 1 << (7 - i) : 0))
      .reduce((or, bit) => or | bit)
  )
);

const MOVE = {
  "<": (r: number) => r << 1,
  ">": (r: number) => r >> 1,
};

const jetPattern = file.split("");

const draw = (chamber) => {
  for (let i = 0; i <= chamber.length - 1; i++) {
    const row = chamber[i];
    const binary = row.toString(2).padStart(9, "0");
    console.log(binary);
  }
  console.log();
};

const moveDown = (
  rock: Array<number>,
  height: number,
  chamber: Array<number>
) => {
  rock.forEach((row, index) => {
    if (height + index < chamber.length) {
      chamber[height + index] |= row;
    }
  });
};
let extraHeight = 0;

const getTopView = (chamber) => {
  // @ts-ignore
  let maxYs: Array<number> = Array.from({ length: 7 }).fill(10000);
  for (let i = 0; i < chamber.length; i++) {
    const row = chamber[i];
    const binary = row.toString(2).padStart(9, "0");

    for (let j = 1; j < binary.length - 1; j++) {
      if (binary[j] === "1") {
        maxYs[j - 1] = Math.min(maxYs[j - 1], i);
      }
    }
  }

  return maxYs;
};

const part2 = () => {
  let chamber = [0b111111111];
  let jetPatternIndex = 0;

  let seen = {};
  let maxHeight = 0;

  for (let i = 0; i < 1000000000000; i++) {
    const rockIndex = i % ROCKS.length;
    let rock = ROCKS[rockIndex];
    Array.from({ length: rock.length + START_MOVES }).forEach((row) =>
      chamber.unshift(0b100000001)
    );

    let landed = false;
    let height = 0;
    let moveIndex: number | null = null;

    for (let i = 0; i < START_MOVES; i++) {
      moveIndex = jetPatternIndex++ % jetPattern.length;
      const move = MOVE[jetPattern[moveIndex]];

      // xcheck if we can move to sides (jet)
      if (!rock.some((row, index) => chamber[height + index] & move(row))) {
        rock = rock.map(move);
      }

      // check if can go down
      if (rock.some((row, index) => chamber[height + index + 1] & row)) {
        moveDown(rock, height, chamber);
      }
      height++;
    }

    while (!landed) {
      moveIndex = jetPatternIndex++ % jetPattern.length;
      const move = MOVE[jetPattern[moveIndex]];

      // xcheck if we can move to sides (jet)
      if (!rock.some((row, index) => chamber[height + index] & move(row))) {
        rock = rock.map(move);
      }

      // check if can go down
      if (rock.some((row, index) => chamber[height + index + 1] & row)) {
        moveDown(rock, height, chamber);
        landed = true;
      }
      height++;
    }

    chamber = chamber.slice(chamber.findIndex((r) => r !== 0b100000001));
    maxHeight = chamber.length - 1;

    const seenTopChamber = String(getTopView(chamber));

    if (seen[`${moveIndex}-${rockIndex}-${seenTopChamber}`]) {
      const [oldI, maxOldHeight] =
        seen[`${moveIndex}-${rockIndex}-${seenTopChamber}`];

      const repeat = Math.floor((1000000000000 - i) / (i - oldI));
      i += (i - oldI) * repeat;
      extraHeight += repeat * (maxHeight - maxOldHeight);
      seen = {};
    }

    seen[`${moveIndex}-${rockIndex}-${seenTopChamber}`] = [i, maxHeight];
  }
  return chamber.length - 1;
};

console.log("Result -> ", part2() + extraHeight);
