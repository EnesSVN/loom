import test from "node:test";
import assert from "node:assert/strict";
import { mount, createText, h, FRAGMENT } from "@loom/core";
import { createFakeNode, createFakeDocument } from "../test-utils/fake-dom.js";

test("mount, metin dugumunu container'a ekler", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(createText("merhaba"), container, doc);

  assert.equal(container.childNodes.length, 1);
  assert.equal(container.childNodes[0].nodeValue, "merhaba");
});

test("mount, element'i ve icindeki metni ekler", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(h("div", {}, ["merhaba"]), container, doc);

  const div = container.childNodes[0];
  assert.equal(div.tagName, "div");
  assert.equal(div.childNodes[0].nodeValue, "merhaba");
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

test("mount, fragment'in cocuklarini container'a tasir", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  mount(h(FRAGMENT, {}, ["bir", "iki"]), container, doc);

  assert.equal(container.childNodes.length, 2);
  assert.equal(container.childNodes[0].nodeValue, "bir");
  assert.equal(container.childNodes[1].nodeValue, "iki");
});

test("mount, uretilen DOM node'unu vnode.el'e yazar", () => {
  const doc = createFakeDocument();
  const container = createFakeNode();

  const vnode = h("div", {});
  mount(vnode, container, doc);

  assert.equal(vnode.el, container.childNodes[0]);
});
