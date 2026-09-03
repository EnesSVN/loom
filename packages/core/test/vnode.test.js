import test from "node:test";
import assert from "node:assert/strict";
import {
  createText,
  TEXT,
  createElement,
  createFragment,
  FRAGMENT,
} from "@loom/core";

test("createText returns a text node with type and value", () => {
  const node = createText("hello");

  assert.equal(node.type, TEXT);
  assert.equal(node.value, "hello");
  assert.equal(node.children, undefined);
});

test("createElement returns an element node with type, props and children", () => {
  const node = createElement("div", { id: "a" }, []);

  assert.equal(node.type, "div");
  assert.equal(node.props.id, "a");
  assert.ok(Array.isArray(node.children));
});

test("createElement defaults props to {} and children to []", () => {
  const node = createElement("div");

  assert.equal(node.type, "div");
  assert.deepEqual(node.props, {});
  assert.deepEqual(node.children, []);
});

test("createFragment returns a fragment node with children", () => {
  const node = createFragment([]);

  assert.equal(node.type, FRAGMENT);
  assert.deepEqual(node.children, []);
});
