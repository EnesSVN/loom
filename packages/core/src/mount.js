import { TEXT } from "./vnode.js";

export const mount = (vnode, container, doc = globalThis.document) => {
  if (vnode.type === TEXT) {
    const textNode = doc.createTextNode(vnode.value);
    container.appendChild(textNode);
    return textNode;
  }
  const el = doc.createElement(vnode.type);
  for (const child of vnode.children) {
    mount(child, el, doc);
  }
  container.appendChild(el);
  return el;
};
