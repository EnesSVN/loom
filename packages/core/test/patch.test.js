import test from "node:test";
import assert from "node:assert/strict";
import { mount, patch, createText, h } from "@loom/core";
import { createFakeNode, createFakeDocument } from "../test-utils/fake-dom.js";

test("patch, metin degisince ayni DOM node'unu gunceller", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const eski = createText("a");
  mount(eski, container, doc);
  const domNode = container.childNodes[0];

  const yeni = createText("b");
  patch(eski, yeni);

  assert.equal(domNode.nodeValue, "b");
  assert.equal(container.childNodes.length, 1);
  assert.equal(container.childNodes[0], domNode);
  assert.equal(yeni.el, domNode);
});

test("patch, tur degisince eski node'u yenisiyle degistirir", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const eski = h("div", {});
  mount(eski, container, doc);
  const eskiDom = container.childNodes[0];

  const yeni = h("span", {});
  patch(eski, yeni, doc);

  assert.equal(container.childNodes.length, 1);
  assert.equal(container.childNodes[0].tagName, "span");
  assert.notEqual(container.childNodes[0], eskiDom);
  assert.equal(yeni.el, container.childNodes[0]);
});
