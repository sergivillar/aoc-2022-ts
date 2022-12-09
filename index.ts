import { existsSync } from "fs";
import { execSync } from "child_process";

const day = process.argv[2];
const part = process.argv[3];

if (!day) {
  console.error("No day selected");
  process.exit(1);
}

if (!part) {
  console.error("No part selected");
  process.exit(1);
}

if (part !== "1" && part !== "2") {
  console.error("Part must be 1 or 2");
  process.exit(1);
}

if (existsSync(day)) {
  execSync(`node --loader ts-node/esm/transpile-only ${day}/${part}.ts`, {
    stdio: "inherit",
    cwd: __dirname,
  });
} else {
  console.error(`Day ${day} not found`);
  process.exit(1);
}
