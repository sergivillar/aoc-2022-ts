import { readFile } from "../utils/read-file";

type Point = { x: number; y: number };

const ROW = 2000000;

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
      beacon: beaconPoint,
      distance: distance(beaconPoint, sensorPoint),
      point: sensorPoint,
    };
    map[getKey(beaconPoint)] = { value: BEACON };
  });
  return map;
};

const MAP = parseMap(lines);
const sensors = Object.entries(MAP).filter((item) => item[1].value === SENSOR);
const xPoints = new Set();

for (let i = 0; i < sensors.length; i++) {
  const sensor = sensors[i];
  const distance = sensor[1].distance;
  const originalPoint = sensor[1].point;
  const beaconPoint = sensor[1].beacon;
  const distanceToRow = Math.abs(ROW - originalPoint.y);
  const remainingDistance = distance - distanceToRow;

  if (remainingDistance < 0) {
    continue;
  }

  for (
    let offsetX = -remainingDistance;
    offsetX <= remainingDistance;
    offsetX++
  ) {
    const nextX = originalPoint.x + offsetX;
    if (nextX !== beaconPoint.x || ROW !== beaconPoint.y) {
      xPoints.add(nextX);
    }
  }
}

console.log("Result -> ", xPoints.size);
