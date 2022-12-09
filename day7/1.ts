import { readFile } from "../utils/read-file";

const file = readFile(__dirname + "/input.txt").split("\n");

function Node(name: string, size?: number | undefined) {
  this.size = size;
  this.name = name;
  this.children = [];
  this.parent = null;
}

const fileRegExp = /(\d+) ([a-zA-Z](\.[a-zA-Z]+)?)/;
const dirRegExp = /dir ([a-zA-Z]+)/;
const commandRegExp = /\$ (\w+)\s?(.+)?/;

const isFile = (line: string) => line.match(fileRegExp);
const isDir = (line: string) => line.match(dirRegExp);
const isCommand = (line: string) => line.match(commandRegExp);

const getFileInfo = (file: string) => {
  const info = isFile(file);

  if (!info) throw new Error("error parsing file");

  return { size: Number(info[1]), name: info[2] };
};

const getDirInfo = (dir: string) => {
  const info = isDir(dir);

  if (!info) throw new Error("error parsing dir");

  return { name: info[1] };
};

const getCommandInfo = (command: string) => {
  const info = isCommand(command);

  if (!info) throw new Error("error parsing command");

  return { name: info[1], args: info[2] };
};

const rootDir = new Node("/");
let currentDir = rootDir;

file.forEach((line) => {
  if (isFile(line)) {
    const file = getFileInfo(line);
    const node = new Node(file.name, file.size);
    node.parent = currentDir;
    currentDir?.children.push(node);
  }

  if (isDir(line)) {
    const dir = getDirInfo(line);
    const node = new Node(dir.name);
    node.parent = currentDir;
    currentDir?.children.push(node);
  }

  if (isCommand(line)) {
    const command = getCommandInfo(line);

    if (command.name === "cd") {
      if (command.args === "/") {
        currentDir = rootDir;
      } else if (command.args === "..") {
        currentDir = currentDir?.parent || null;
      } else {
        const nextDir = currentDir?.children.find(
          ({ name }) => name === command.args
        );
        if (!nextDir) {
          throw new Error(`error next dir ${command.args}`);
        }

        currentDir = nextDir;
      }
    }
  }
});

const calculateDirSizes = (node) => {
  if (node.children.length === 0 || node.size !== undefined) {
    return node.size;
  }

  let total = 0;
  node.children.forEach((child) => {
    total += calculateDirSizes(child);
  });

  node.size = total;
  return total;
};

calculateDirSizes(rootDir);

const MAX_SIZE = 100000;

let total = 0;

const getResult = (node) => {
  node.children.forEach((child) => {
    // if is dir and is bellow max size
    if (child.children.length > 0 && child.size <= MAX_SIZE) {
      total += child.size;
    }
    getResult(child);
  });
};

getResult(rootDir);

console.log("Result -> ", total);
