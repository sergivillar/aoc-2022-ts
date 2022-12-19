import { readFile } from "../utils/read-file";
import Queue from "../utils/queue";

const ROBOT_REGEXP =
  /Blueprint \d+: Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\./;
const MINUTES = 24;

type Recipe = {
  ore: { ore: number; limit: number };
  clay: { ore: number; limit: number };
  obsidian: { ore: number; clay: number; limit: number };
  geode: { ore: number; obsidian: number; limit: number };
};

const file = readFile(__dirname + "/input.txt").split("\n");

const recipes = file.reduce((acc, line) => {
  const matches = line.match(ROBOT_REGEXP);

  if (!matches) return acc;

  const parsed = {
    ore: { ore: Number(matches[1]) },
    clay: { ore: Number(matches[2]) },
    obsidian: { ore: Number(matches[3]), clay: Number(matches[4]) },
    geode: { ore: Number(matches[5]), obsidian: Number(matches[6]) },
  };
  const parsedWithLimits = {
    ore: {
      ...parsed.ore,
      limit: Math.max(
        parsed.ore.ore,
        parsed.clay.ore,
        parsed.obsidian.ore,
        parsed.geode.ore
      ),
    },
    clay: { ...parsed.clay, limit: parsed.obsidian.clay },
    obsidian: { ...parsed.obsidian, limit: parsed.geode.obsidian },
    geode: { ...parsed.geode, limit: Infinity },
  };
  acc.push(parsedWithLimits);
  return acc;
}, [] as Array<Recipe>);

const initialResources = [0, 0, 0, 0];
const initialRobots = [1, 0, 0, 0];

const collectResources = (
  robots: [number, number, number, number],
  currentResources: [number, number, number, number]
) => {
  const newResources = [...currentResources];
  robots.forEach((robot, index) => {
    newResources[index] += robot;
  });
  return newResources;
};

const createRobots = (
  recipe: Recipe,
  currentResources: [number, number, number, number],
  robots: [number, number, number, number],
  robotType: keyof Recipe
): {
  newRobots: [number, number, number, number];
  newResources: [number, number, number, number];
} => {
  const newRobots = [...robots] as [number, number, number, number];
  const newResources = [...currentResources] as [
    number,
    number,
    number,
    number
  ];
  if (
    robotType === "geode" &&
    recipe.geode.ore <= currentResources[0] &&
    recipe.geode.obsidian <= currentResources[2]
  ) {
    newRobots[3] += 1;
    newResources[0] -= recipe.geode.ore;
    newResources[2] -= recipe.geode.obsidian;
    return { newRobots, newResources };
  }

  if (
    robotType === "obsidian" &&
    recipe.obsidian.ore <= currentResources[0] &&
    recipe.obsidian.clay <= currentResources[1]
  ) {
    newRobots[2] += 1;
    newResources[0] -= recipe.obsidian.ore;
    newResources[1] -= recipe.obsidian.clay;
    return { newRobots, newResources };
  }

  if (robotType === "clay" && recipe.clay.ore <= currentResources[0]) {
    newRobots[1] += 1;
    newResources[0] -= recipe.clay.ore;
    return { newRobots, newResources };
  }

  if (robotType === "ore" && recipe.ore.ore <= currentResources[0]) {
    newRobots[0] += 1;
    newResources[0] -= recipe.ore.ore;
    return { newRobots, newResources };
  }

  return { newRobots, newResources };
};

const canBuild = (
  recipe: Recipe,
  resources: [number, number, number, number],
  robot: "ore" | "clay" | "obsidian" | "geode"
) => {
  if (
    robot === "geode" &&
    recipe.geode.ore <= resources[0] &&
    recipe.geode.obsidian <= resources[2]
  ) {
    return true;
  }

  if (
    robot === "obsidian" &&
    recipe.obsidian.ore <= resources[0] &&
    recipe.obsidian.clay <= resources[1]
  ) {
    return true;
  }

  if (robot === "clay" && recipe.clay.ore <= resources[0]) {
    return true;
  }

  if (robot === "ore" && recipe.ore.ore <= resources[0]) {
    return true;
  }
  return false;
};

const runBlueprint = (recipe: Recipe) => {
  const resources = [...initialResources];
  const robots = [...initialRobots];
  const recipeMaterials = Object.keys(recipe) as Array<keyof Recipe>;

  const visited = new Set();
  const queue = new Queue();
  queue.enqueue([resources, robots]);

  let currentTime = 0;

  while (queue.length && currentTime < MINUTES) {
    const iterationsAtThisMinute = queue.length;
    for (let i = 0; i < iterationsAtThisMinute; i++) {
      const [currentResources, currentRobots] = queue.deque() as [
        [number, number, number, number],
        [number, number, number, number]
      ];

      const nextKey = `${currentResources}-${currentRobots}`;
      if (visited.has(nextKey)) continue;

      visited.add(nextKey);

      const initialRobotsCycle = [...currentRobots] as [
        number,
        number,
        number,
        number
      ];

      if (canBuild(recipe, currentResources, "geode")) {
        const { newRobots, newResources: resourcesAfterRobots } = createRobots(
          recipe,
          currentResources,
          currentRobots,
          "geode"
        );

        const newResources = collectResources(
          initialRobotsCycle,
          resourcesAfterRobots
        );
        queue.enqueue([newResources, newRobots]);
      } else {
        for (
          let materialIndex = 0;
          materialIndex < recipeMaterials.length;
          materialIndex++
        ) {
          if (
            currentRobots[materialIndex] >=
            recipe[recipeMaterials[materialIndex]].limit
          ) {
            continue;
          }

          if (
            canBuild(recipe, currentResources, recipeMaterials[materialIndex])
          ) {
            const { newRobots, newResources: resourcesAfterRobots } =
              createRobots(
                recipe,
                currentResources,
                currentRobots,
                recipeMaterials[materialIndex]
              );

            const newResources = collectResources(
              initialRobotsCycle,
              resourcesAfterRobots
            );
            queue.enqueue([newResources, newRobots]);
          }
        }

        const newResources = collectResources(
          initialRobotsCycle,
          currentResources
        );
        queue.enqueue([newResources, currentRobots]);
      }
    }

    currentTime += 1;
  }

  let total = 0;
  while (queue.length) {
    const [currentResources] = queue.deque() as [
      [number, number, number, number]
    ];

    total = Math.max(total, currentResources[3]);
  }
  return total;
};

const result = recipes.reduce(
  (acc, curr, index) => acc + runBlueprint(curr) * (index + 1),
  0
);

console.log("Result -> ", result);
