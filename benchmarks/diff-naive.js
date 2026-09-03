import { h, mount, patch } from "@loom/core";

function createCountingDocument() {
  const counts = {
    createElement: 0,
    createTextNode: 0,
    setAttribute: 0,
    appendChild: 0,
    insertBefore: 0,
    removeChild: 0,
    replaceChild: 0,
    textUpdate: 0,
  };

  const makeNode = (tag) => ({
    tagName: tag,
    parentNode: null,
    childNodes: [],
    attributes: {},
    style: {},
    appendChild(child) {
      counts.appendChild++;
      child.parentNode = this;
      this.childNodes.push(child);
      return child;
    },
    insertBefore(newNode, referenceNode) {
      counts.insertBefore++;
      if (referenceNode === newNode) {
        const index = this.childNodes.indexOf(newNode);
        referenceNode = this.childNodes[index + 1] ?? null;
      }
      if (newNode.parentNode) {
        const currentIndex = newNode.parentNode.childNodes.indexOf(newNode);
        if (currentIndex !== -1) {
          newNode.parentNode.childNodes.splice(currentIndex, 1);
        }
      }
      const index =
        referenceNode == null
          ? this.childNodes.length
          : this.childNodes.indexOf(referenceNode);
      this.childNodes.splice(index, 0, newNode);
      newNode.parentNode = this;
      return newNode;
    },
    removeChild(child) {
      counts.removeChild++;
      this.childNodes.splice(this.childNodes.indexOf(child), 1);
      child.parentNode = null;
      return child;
    },
    replaceChild(newNode, oldNode) {
      counts.replaceChild++;
      this.childNodes[this.childNodes.indexOf(oldNode)] = newNode;
      newNode.parentNode = this;
      return oldNode;
    },
    setAttribute(name, value) {
      counts.setAttribute++;
      this.attributes[name] = value;
    },
    removeAttribute(name) {
      delete this.attributes[name];
    },
    addEventListener() {},
  });

  const doc = {
    createElement(tag) {
      counts.createElement++;
      return makeNode(tag);
    },
    createTextNode(value) {
      counts.createTextNode++;
      const node = { nodeType: "text", parentNode: null };
      let content = String(value);
      Object.defineProperty(node, "nodeValue", {
        get: () => content,
        set: (next) => {
          counts.textUpdate++;
          content = String(next);
        },
      });
      return node;
    },
    createDocumentFragment() {
      const fragment = makeNode();
      fragment.nodeType = "fragment";
      return fragment;
    },
  };

  return { doc, counts };
}

const N = 1000;

const unkeyedList = (items) =>
  h(
    "ul",
    {},
    items.map((i) => h("li", {}, [String(i)])),
  );

const keyedList = (items) =>
  h(
    "ul",
    {},
    items.map((i) => h("li", { key: i }, [String(i)])),
  );

const numbers = Array.from({ length: N }, (_, i) => i);

function measure(label, nextItems, build = unkeyedList) {
  const { doc, counts } = createCountingDocument();
  const container = {
    childNodes: [],
    appendChild(node) {
      this.childNodes.push(node);
      node.parentNode = this;
      return node;
    },
  };

  const prev = build(numbers);
  mount(prev, container, doc);

  for (const key of Object.keys(counts)) counts[key] = 0;

  const next = build(nextItems);
  patch(prev, next, doc);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`\n${label}`);
  console.log(`  total DOM operations : ${total}`);
  for (const [key, value] of Object.entries(counts)) {
    if (value > 0) console.log(`    ${key.padEnd(18)}: ${value}`);
  }
}

console.log(`Unkeyed diff — list of ${N}`);
measure("append at end   [0..999] -> [0..999, 'new']", [...numbers, "new"]);
measure("prepend at front [0..999] -> ['new', 0..999]", ["new", ...numbers]);

console.log(`\n\nKeyed diff — list of ${N}`);
measure("append at end", [...numbers, "new"], keyedList);
measure("prepend at front", ["new", ...numbers], keyedList);
