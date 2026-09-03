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

test("patch, degisen attribute'u gunceller", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const eski = h("div", { id: "a" });
  mount(eski, container, doc);
  const domNode = container.childNodes[0];

  const yeni = h("div", { id: "b" });
  patch(eski, yeni, doc);

  assert.equal(domNode.attributes.id, "b");
  assert.equal(container.childNodes[0], domNode);
});

test("patch, degisen attribute'u gunceller", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const eski = h("div", { id: "a" });
  mount(eski, container, doc);
  const domNode = container.childNodes[0];

  const yeni = h("div", { id: "b" });
  patch(eski, yeni, doc);

  assert.equal(domNode.attributes.id, "b");
  assert.equal(container.childNodes[0], domNode);
});

test("patch, silinen attribute'u DOM'dan kaldirir", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const eski = h("div", { id: "a" });
  mount(eski, container, doc);
  const domNode = container.childNodes[0];

  const yeni = h("div", {});
  patch(eski, yeni, doc);

  assert.equal(domNode.attributes.id, undefined);
});

test("patch, cocuklari ayni pozisyonda karsilastirir", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const eski = h("div", {}, ["a"]);
  mount(eski, container, doc);
  const divDom = container.childNodes[0];
  const textDom = divDom.childNodes[0];

  const yeni = h("div", {}, ["b"]);
  patch(eski, yeni, doc);

  assert.equal(textDom.nodeValue, "b");
  assert.equal(divDom.childNodes.length, 1);
  assert.equal(divDom.childNodes[0], textDom);
});

test("patch, yeni cocuklari ekler", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const eski = h("ul", {}, ["a"]);
  mount(eski, container, doc);
  const ulDom = container.childNodes[0];

  const yeni = h("ul", {}, ["a", "b"]);
  patch(eski, yeni, doc);

  assert.equal(ulDom.childNodes.length, 2);
  assert.equal(ulDom.childNodes[1].nodeValue, "b");
});

test("patch, fazla cocuklari siler", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const eski = h("ul", {}, ["a", "b"]);
  mount(eski, container, doc);
  const ulDom = container.childNodes[0];

  const yeni = h("ul", {}, ["a"]);
  patch(eski, yeni, doc);

  assert.equal(ulDom.childNodes.length, 1);
  assert.equal(ulDom.childNodes[0].nodeValue, "a");
});
