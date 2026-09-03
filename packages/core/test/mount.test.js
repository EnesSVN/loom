import test from "node:test";
import assert from "node:assert/strict";
import { mount, createText, h } from "@loom/core";

function createFakeNode(tag) {
  return {
    tagName: tag,
    childNodes: [],
    appendChild(node) {
      this.childNodes.push(node);
      return node;
    },
  };
}

function createFakeDocument() {
  return {
    createTextNode(value) {
      return { nodeType: "text", value };
    },
    createElement(tag) {
      return createFakeNode(tag);
    },
  };
}

test("mount, metin dugumunu container'a ekler", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(createText("merhaba"), container, doc);

  assert.equal(container.childNodes.length, 1);
  assert.equal(container.childNodes[0].value, "merhaba");
});

test("mount, element'i ve icindeki metni ekler", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(h("div", {}, ["merhaba"]), container, doc);

  const div = container.childNodes[0];
  assert.equal(div.tagName, "div");
  assert.equal(div.childNodes[0].value, "merhaba");
});
