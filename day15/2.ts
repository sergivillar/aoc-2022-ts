import { readFile } from "../utils/read-file";

type Point = { x: number; y: number };

const X = 4000000;
const Y = 4000000;

const SENSOR = "S";
const BEACON = "B";

const lines = readFile(__dirname + "/input.txt").split("\n");

const distance = (point1: Point, point2: Point) =>
  Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);

const getKey = ({ x, y }: Point) => `${x},${y}`;

const getXYValues = (line: string) => {
  const match = line.match(/x=(-?\d+), y=(-?\d+)/);

  if (!match) throw Error("error parsing");
  return { x: Number(match[1]), y: Number(match[2]) };
};

const parseMap = (lines: Array<string>) => {
  const map: Record<string, Record<string, any>> = {};

  lines.forEach((line) => {
    const points = line.split(": ");
    const sensorPoint = getXYValues(points[0]);
    const beaconPoint = getXYValues(points[1]);

    map[getKey(sensorPoint)] = {
      value: SENSOR,
      distance: distance(beaconPoint, sensorPoint),
      point: sensorPoint,
    };
    map[getKey(beaconPoint)] = { value: BEACON };
  });
  return map;
};

const MAP = parseMap(lines);
const sensors = Object.entries(parseMap(lines)).filter(
  ([, data]) => data.value === SENSOR
);

const getIntervals = (y: number) => {
  const intervals: Array<Array<number>> = [];
  sensors.forEach((sensor) => {
    const originalPoint = sensor[1].point;
    const distance = sensor[1].distance;
    const xSpace = distance - Math.abs(originalPoint.y - y);
    if (xSpace >= 0) {
      intervals.push([
        Math.max(originalPoint.x - xSpace, 0),
        Math.min(originalPoint.x + xSpace, X),
      ]);
    }
  });
  return intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};

const mergeRanges = (ranges: Array<Array<number>>) =>
  ranges.reduce(
    (acc: Array<Array<number>>, curr) => {
      const [, lastEndX] = acc[acc.length - 1];

      if (lastEndX >= curr[1]) return acc;

      if (lastEndX >= curr[0]) {
        acc[acc.length - 1][1] = curr[1];
        return acc;
      }

      acc.push(curr);
      return acc;
    },
    [ranges[0]]
  );

const getResult = () => {
  for (let y = 0; y <= Y; y++) {
    const intervals = getIntervals(y);
    const ranges = mergeRanges(intervals);
    if (ranges.length > 1) {
      const x = ranges[0][1] + 1;
      return x * X + y;
    }
  }
};

console.log("Result -> ", getResult());
