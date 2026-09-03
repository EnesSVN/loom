import test from "node:test";
import assert from "node:assert/strict";
import { mount, createText, h } from "@loom/core";

function createFakeNode(tag) {
  return {
    tagName: tag,
    childNodes: [],
    attributes: {},
    style: {},
    listeners: {},
    appendChild(node) {
      this.childNodes.push(node);
      return node;
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    addEventListener(type, handler) {
      this.listeners[type] ??= [];
      this.listeners[type].push(handler);
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

test("mount, siradan prop'u attribute olarak yazar", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(h("div", { id: "a" }), container, doc);

  const div = container.childNodes[0];
  assert.equal(div.attributes.id, "a");
});

test("mount, event listener ekler", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const handleClick = () => {};
  mount(h("div", { onClick: handleClick }), container, doc);

  const div = container.childNodes[0];
  assert.equal(div.listeners.click[0], handleClick);
  assert.equal(div.attributes.onClick, undefined);
});

test("mount, siradan prop'u DOM property olarak yazar", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(h("input", { value: "test", checked: true }), container, doc);

  const input = container.childNodes[0];
  assert.equal(input.value, "test");
  assert.equal(input.checked, true);
  assert.equal(input.attributes.value, undefined);
  assert.equal(input.attributes.checked, undefined);
});

test("mount, style prop'unu uygular", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(
    h("div", { style: { color: "red", backgroundColor: "blue" } }),
    container,
    doc,
  );

  const div = container.childNodes[0];
  assert.equal(div.style.color, "red");
  assert.equal(div.style.backgroundColor, "blue");
  assert.equal(div.attributes.style, undefined);
});
