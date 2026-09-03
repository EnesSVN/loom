import { TEXT } from "./vnode.js";
import { createDom } from "./mount.js";

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
  }
  return nextVNode.el;
};
