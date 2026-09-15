import { TEXT } from "./vnode.js";
import { createDom, setProp, mount } from "./mount.js";
import { lis } from "./lis.js";

export const patch = (prevVNode, nextVNode, doc = globalThis.document) => {
  if (prevVNode.type !== nextVNode.type) {
    const parent = prevVNode.el.parentNode;
    const newEl = createDom(nextVNode, doc);
    parent.replaceChild(newEl, prevVNode.el);
    return newEl;
  }

  nextVNode.el = prevVNode.el;

  if (prevVNode.type === TEXT) {
    if (prevVNode.value !== nextVNode.value) {
      prevVNode.el.nodeValue = String(nextVNode.value);
    }
    return prevVNode.el;
  }

  for (const [key, value] of Object.entries(nextVNode.props)) {
    if (prevVNode.props[key] !== value) {
      setProp(prevVNode.el, key, value);
    }
  }

  for (const key of Object.keys(prevVNode.props)) {
    if (!(key in nextVNode.props)) {
      prevVNode.el.removeAttribute(key);
    }
  }

  patchChildren(prevVNode.children, nextVNode.children, prevVNode.el, doc);
  return nextVNode.el;
};

export const patchChildren = (
  prevChildren,
  nextChildren,
  parentEl,
  doc = globalThis.document,
) => {
  const keyed = nextChildren.length > 0 && nextChildren[0].key !== undefined;

  if (!keyed) {
    const common = Math.min(prevChildren.length, nextChildren.length);
    for (let i = 0; i < common; i++) {
      patch(prevChildren[i], nextChildren[i], doc);
    }
    for (let i = common; i < nextChildren.length; i++) {
      mount(nextChildren[i], parentEl, doc);
    }
    for (let i = common; i < prevChildren.length; i++) {
      parentEl.removeChild(prevChildren[i].el);
    }
    return;
  }

  const prevByKey = new Map();
  for (let i = 0; i < prevChildren.length; i++) {
    const prevChild = prevChildren[i];
    if (prevChild.key !== undefined) {
      prevByKey.set(prevChild.key, i);
    }
  }

  const oldIndexes = [];
  const newIndexes = [];
  for (let i = 0; i < nextChildren.length; i++) {
    const nextChild = nextChildren[i];
    const prevIndex = prevByKey.get(nextChild.key);

    if (prevIndex !== undefined) {
      oldIndexes.push(prevIndex);
      newIndexes.push(i);
      patch(prevChildren[prevIndex], nextChild, doc);
    } else {
      createDom(nextChild, doc);
    }
  }

  const lisPositions = lis(oldIndexes);
  const keep = new Set();
  for (const position of lisPositions) {
    keep.add(newIndexes[position]);
  }

  for (let i = nextChildren.length - 1; i >= 0; i--) {
    if (keep.has(i)) continue;
    const anchor = nextChildren[i + 1]?.el ?? null;
    parentEl.insertBefore(nextChildren[i].el, anchor);
  }

  const nextKeys = new Set(nextChildren.map((child) => child.key));
  for (const prevChild of prevChildren) {
    if (!nextKeys.has(prevChild.key)) {
      parentEl.removeChild(prevChild.el);
    }
  }
};
