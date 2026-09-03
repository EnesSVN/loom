import test from "node:test";
import assert from "node:assert/strict";
import { TEXT, h } from "@loom/core";

test("h wraps string children in text vnodes", () => {
  const vnode = h("div", { id: "test" }, ["Hello"]);

  assert.equal(vnode.children.length, 1);
  assert.equal(vnode.children[0].type, TEXT);
  assert.equal(vnode.children[0].value, "Hello");
});

test("h drops null, undefined and false but keeps 0 and empty string", () => {
  const vnode = h("div", {}, ["a", null, undefined, false, 0, "", "b"]);

  assert.equal(vnode.children.length, 4);
  assert.equal(vnode.children[0].value, "a");
  assert.equal(vnode.children[1].value, 0);
  assert.equal(vnode.children[2].value, "");
  assert.equal(vnode.children[3].value, "b");
});

test("h flattens nested children arrays", () => {
  const vnode = h("div", {}, ["a", ["b", ["c"]]]);

  assert.equal(vnode.children.length, 3);
  assert.equal(vnode.children[0].value, "a");
  assert.equal(vnode.children[1].value, "b");
  assert.equal(vnode.children[2].value, "c");
});

test("h moves key out of props onto the vnode", () => {
  const vnode = h("li", { key: 1, id: "x" }, ["a"]);

  assert.equal(vnode.key, 1);
  assert.equal(vnode.props.key, undefined);
  assert.equal(vnode.props.id, "x");
});

test("h does not mutate the props object it is given", () => {
  const props = { key: 1, id: "x" };

  h("li", props, []);
  const second = h("li", props, []);

  assert.equal(second.key, 1);
});
