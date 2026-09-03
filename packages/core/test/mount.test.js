import test from "node:test";
import assert from "node:assert/strict";
import { mount, createText, h, FRAGMENT } from "@loom/core";
import { createFakeNode, createFakeDocument } from "../test-utils/fake-dom.js";

test("mount appends a text node to the container", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(createText("hello"), container, doc);

  assert.equal(container.childNodes.length, 1);
  assert.equal(container.childNodes[0].nodeValue, "hello");
});

test("mount appends an element and its text child", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(h("div", {}, ["hello"]), container, doc);

  const div = container.childNodes[0];
  assert.equal(div.tagName, "div");
  assert.equal(div.childNodes[0].nodeValue, "hello");
});

test("mount writes a plain prop as an attribute", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(h("div", { id: "a" }), container, doc);

  const div = container.childNodes[0];
  assert.equal(div.attributes.id, "a");
});

test("mount binds an on* prop as an event listener", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const handleClick = () => {};
  mount(h("div", { onClick: handleClick }), container, doc);

  const div = container.childNodes[0];
  assert.equal(div.listeners.click[0], handleClick);
  assert.equal(div.attributes.onClick, undefined);
});

test("mount writes known props as DOM properties, not attributes", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(h("input", { value: "test", checked: true }), container, doc);

  const input = container.childNodes[0];
  assert.equal(input.value, "test");
  assert.equal(input.checked, true);
  assert.equal(input.attributes.value, undefined);
  assert.equal(input.attributes.checked, undefined);
});

test("mount applies a style object field by field", () => {
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

test("mount moves fragment children into the container", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(h(FRAGMENT, {}, ["one", "two"]), container, doc);

  assert.equal(container.childNodes.length, 2);
  assert.equal(container.childNodes[0].nodeValue, "one");
  assert.equal(container.childNodes[1].nodeValue, "two");
});

test("mount stores the created DOM node on vnode.el", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const vnode = h("div", {});
  mount(vnode, container, doc);

  assert.equal(vnode.el, container.childNodes[0]);
});

test("mount does not write key as an attribute", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(h("li", { key: 1 }, ["a"]), container, doc);

  assert.equal(container.childNodes[0].attributes.key, undefined);
});
