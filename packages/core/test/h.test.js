import test from "node:test";
import assert from "node:assert/strict";
import { TEXT, h } from "@loom/core";

test("h function creates vnode correctly", () => {
  const vnode = h("div", { id: "test" }, ["Hello"]);
  assert.equal(vnode.children.length, 1);
  assert.equal(vnode.children[0].type, TEXT);
  assert.equal(vnode.children[0].value, "Hello");
});

test("h's children are ('a', null, undefined, false, 0, '', 'b') normalized correctly", () => {
  const vnode = h("div", {}, ["a", null, undefined, false, 0, "", "b"]);
  assert.equal(vnode.children.length, 4);
  assert.equal(vnode.children[0].value, "a");
  assert.equal(vnode.children[1].value, 0);
  assert.equal(vnode.children[2].value, "");
  assert.equal(vnode.children[3].value, "b");
});
