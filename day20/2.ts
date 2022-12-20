import { readFile } from "../utils/read-file";

const KEY = 811589153;

type Node = {
  value: number;
  prev?: Node;
  next?: Node;
};

class DoublyLinkedList {
  public length: number;
  private head?: Node;
  private tail?: Node;

  constructor() {
    this.length = 0;
    this.head = undefined;
    this.tail = undefined;
  }

  appendAt(node: Node, idx: number): void {
    this.length++;

    for (let i = 0; i < idx; i++) {
      node.next = node.next?.next;
    }
    node.prev = node.next?.prev;

    if (node.prev) {
      node.prev.next = node;
    }
    if (node.next) {
      node.next.prev = node;
    }
  }

  append(item: number): Node {
    const node = { value: item } as Node;

    this.length++;
    if (!this.tail) {
      this.head = this.tail = node;
      return node;
    }

    node.prev = this.tail;
    this.tail.next = node;
    this.tail = node;
    // circular
    this.tail.next = this.head;

    if (this.head) {
      // circular
      this.head.prev = this.tail;
    }

    return node;
  }

  removeNode(node: Node): number | undefined {
    this.length--;

    if (node.prev) {
      node.prev.next = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    }
    return node.value;
  }

  print() {
    let output = "";
    let curr = this.head;
    if (!curr) return;

    for (let i = 0; i < this.length; i++) {
      output += `${curr?.value} -> `;
      curr = curr?.next;
    }
    console.log(output);
  }
}

const input = readFile(__dirname + "/input.txt")
  .split("\n")
  .map(Number);
const linkedList = new DoublyLinkedList();

const nodes: Array<Node> = [];
let zeroNode: Node = { value: 0 };

input.forEach((number) => {
  const node = linkedList.append(number * KEY);
  nodes.push(node);
  if (number === 0) {
    zeroNode = node;
  }
});

for (let i = 0; i < 10; i++) {
  nodes.forEach((node) => {
    let nextIndex = node.value % (nodes.length - 1); // Sum current index
    if (nextIndex < 0) {
      nextIndex += nodes.length - 1;
    }

    linkedList.removeNode(node);
    linkedList.appendAt(node, nextIndex);
  });
}

let result = 0;
for (let i = 1; i <= 3000; i++) {
  if (zeroNode) {
    if (zeroNode.next) {
      zeroNode = zeroNode.next;
    }
    if (i === 1000 || i === 2000 || i === 3000) {
      result += zeroNode.value;
    }
  }
}

console.log("Result -> ", result);
