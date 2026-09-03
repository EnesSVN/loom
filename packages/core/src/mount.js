import { TEXT, FRAGMENT } from "./vnode.js";

const PROPS = ["checked", "value", "selected", "disabled"];

export const mount = (vnode, container, doc = globalThis.document) => {
  if (vnode.type === TEXT) {
    const textNode = doc.createTextNode(vnode.value);
    container.appendChild(textNode);
    return textNode;
  }
  if (vnode.type === FRAGMENT) {
    const frag = doc.createDocumentFragment();
    for (const child of vnode.children) {
      mount(child, frag, doc);
    }
    container.appendChild(frag);
    return frag;
  }
  const el = doc.createElement(vnode.type);
  for (const [key, value] of Object.entries(vnode.props)) {
    switch (true) {
      case key.startsWith("on") && typeof value === "function": {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, value);
        break;
      }
      case key === "style" && typeof value === "object": {
        for (const [styleName, styleValue] of Object.entries(value)) {
          el.style[styleName] = styleValue;
        }
        break;
      }
      case PROPS.includes(key): {
        el[key] = value;
        break;
      }
      default: {
        el.setAttribute(key, value);
      }
    }
  }
  for (const child of vnode.children) {
    mount(child, el, doc);
  }
  container.appendChild(el);
  return el;
};
