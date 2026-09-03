import { TEXT } from "./vnode.js";
import { createDom, setProp, mount } from "./mount.js";

export const patch = (prevVNode, nextVNode, doc = globalThis.document) => {
  if (prevVNode.type !== nextVNode.type) {
    const parent = prevVNode.el.parentNode;
    const newEl = createDom(nextVNode, doc);
    parent.replaceChild(newEl, prevVNode.el);
    return nextVNode.el;
  }

  nextVNode.el = prevVNode.el;

  if (prevVNode.type === TEXT) {
    if (prevVNode.value !== nextVNode.value) {
      prevVNode.el.nodeValue = String(nextVNode.value);
    }
    return nextVNode.el;
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
  for (const prevChild of prevChildren) {
    prevByKey.set(prevChild.key, prevChild);
  }

  for (let i = 0; i < nextChildren.length; i++) {
    const nextChild = nextChildren[i];
    const prevChild = prevByKey.get(nextChild.key);

    let domNode;
    if (prevChild) {
      patch(prevChild, nextChild, doc);
      domNode = nextChild.el;
    } else {
      domNode = createDom(nextChild, doc);
    }

    parentEl.insertBefore(domNode, parentEl.childNodes[i] ?? null);
  }

  const nextKeys = new Set(nextChildren.map((child) => child.key));
  for (const prevChild of prevChildren) {
    if (!nextKeys.has(prevChild.key)) {
      parentEl.removeChild(prevChild.el);
    }
  }
};
