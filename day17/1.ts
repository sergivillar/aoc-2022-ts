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

const part1 = () => {
  let chamber = [0b111111111];
  let jetPatternIndex = 0;

  for (let i = 0; i < 2022; i++) {
    let rock = ROCKS[i % ROCKS.length];
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
  }

  return chamber.length - 1;
};

console.log("Result -> ", part1());
