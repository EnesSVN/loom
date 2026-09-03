import { TEXT } from "./vnode.js";
import { createDom, setProp } from "./mount.js";

export const patch = (prevVNode, nextVNode, doc = globalThis.document) => {
  if (prevVNode.type !== nextVNode.type) {
    const parent = prevVNode.el.parentNode;
    const newEl = createDom(nextVNode, doc);
    parent.replaceChild(newEl, prevVNode.el);
    nextVNode.el = newEl;
    return nextVNode.el;
  }

  nextVNode.el = prevVNode.el;
  if (prevVNode.type === TEXT) {
    prevVNode.el.nodeValue = String(nextVNode.value);
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

  return nextVNode.el;
};
