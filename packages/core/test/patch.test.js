import test from "node:test";
import assert from "node:assert/strict";
import { mount, patch, createText, h } from "@loom/core";
import { createFakeNode, createFakeDocument } from "../test-utils/fake-dom.js";

test("patch updates the same DOM node when text changes", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const prev = createText("a");
  mount(prev, container, doc);
  const domNode = container.childNodes[0];

  const next = createText("b");
  patch(prev, next, doc);

  assert.equal(domNode.nodeValue, "b");
  assert.equal(container.childNodes.length, 1);
  assert.equal(container.childNodes[0], domNode);
  assert.equal(next.el, domNode);
});

test("patch replaces the node when the type changes", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const prev = h("div", {});
  mount(prev, container, doc);
  const prevDom = container.childNodes[0];

  const next = h("span", {});
  patch(prev, next, doc);

  assert.equal(container.childNodes.length, 1);
  assert.equal(container.childNodes[0].tagName, "span");
  assert.notEqual(container.childNodes[0], prevDom);
  assert.equal(next.el, container.childNodes[0]);
});

test("patch updates a changed attribute in place", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const prev = h("div", { id: "a" });
  mount(prev, container, doc);
  const domNode = container.childNodes[0];

  const next = h("div", { id: "b" });
  patch(prev, next, doc);

  assert.equal(domNode.attributes.id, "b");
  assert.equal(container.childNodes[0], domNode);
});

test("patch removes an attribute that is gone from the new props", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const prev = h("div", { id: "a" });
  mount(prev, container, doc);
  const domNode = container.childNodes[0];

  const next = h("div", {});
  patch(prev, next, doc);

  assert.equal(domNode.attributes.id, undefined);
});

test("patch compares children position by position", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const prev = h("div", {}, ["a"]);
  mount(prev, container, doc);
  const divDom = container.childNodes[0];
  const textDom = divDom.childNodes[0];

  const next = h("div", {}, ["b"]);
  patch(prev, next, doc);

  assert.equal(textDom.nodeValue, "b");
  assert.equal(divDom.childNodes.length, 1);
  assert.equal(divDom.childNodes[0], textDom);
});

test("patch appends children that only exist in the new tree", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const prev = h("ul", {}, ["a"]);
  mount(prev, container, doc);
  const ulDom = container.childNodes[0];

  const next = h("ul", {}, ["a", "b"]);
  patch(prev, next, doc);

  assert.equal(ulDom.childNodes.length, 2);
  assert.equal(ulDom.childNodes[1].nodeValue, "b");
});

test("patch removes children that are gone from the new tree", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const prev = h("ul", {}, ["a", "b"]);
  mount(prev, container, doc);
  const ulDom = container.childNodes[0];

  const next = h("ul", {}, ["a"]);
  patch(prev, next, doc);

  assert.equal(ulDom.childNodes.length, 1);
  assert.equal(ulDom.childNodes[0].nodeValue, "a");
});

test("patch reorders keyed children without recreating their DOM nodes", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const prev = h("ul", {}, [
    h("li", { key: "a" }, ["a"]),
    h("li", { key: "b" }, ["b"]),
    h("li", { key: "c" }, ["c"]),
  ]);
  mount(prev, container, doc);
  const ulDom = container.childNodes[0];
  const liA = ulDom.childNodes[0];
  const liB = ulDom.childNodes[1];
  const liC = ulDom.childNodes[2];

  const next = h("ul", {}, [
    h("li", { key: "c" }, ["c"]),
    h("li", { key: "a" }, ["a"]),
    h("li", { key: "b" }, ["b"]),
  ]);
  patch(prev, next, doc);

  assert.equal(ulDom.childNodes[0], liC);
  assert.equal(ulDom.childNodes[1], liA);
  assert.equal(ulDom.childNodes[2], liB);
});

test("patch removes keyed children that are gone from the new tree", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const prev = h("ul", {}, [
    h("li", { key: "a" }, ["a"]),
    h("li", { key: "b" }, ["b"]),
  ]);
  mount(prev, container, doc);
  const ulDom = container.childNodes[0];

  const next = h("ul", {}, [h("li", { key: "b" }, ["b"])]);
  patch(prev, next, doc);

  assert.equal(ulDom.childNodes.length, 1);
  assert.equal(ulDom.childNodes[0].childNodes[0].nodeValue, "b");
});

test("patch adds new keyed children to a keyed list", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const prev = h("ul", {}, [
    h("li", { key: "a" }, ["a"]),
    h("li", { key: "b" }, ["b"]),
  ]);
  mount(prev, container, doc);
  const ulDom = container.childNodes[0];
  const before = [...ulDom.childNodes];

  const next = h("ul", {}, [
    h("li", { key: "c" }, ["c"]),
    h("li", { key: "a" }, ["a"]),
    h("li", { key: "b" }, ["b"]),
  ]);
  patch(prev, next, doc);

  assert.equal(ulDom.childNodes.length, 3);
  assert.equal(ulDom.childNodes[0].childNodes[0].nodeValue, "c");
  assert.equal(ulDom.childNodes[1], before[0]);
  assert.equal(ulDom.childNodes[2], before[1]);
});
