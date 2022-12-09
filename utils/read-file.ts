import { readFileSync } from "fs";

export const readFile = (path: string): string => {
  try {
    const content = readFileSync(path, { encoding: "utf-8" });
    return content;
  } catch (e) {
    console.error("Error reading file ", path);
    throw e;
  }
};
