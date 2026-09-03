import { TEXT, FRAGMENT } from "./vnode.js";

const PROPS = ["checked", "value", "selected", "disabled"];

export const setProp = (el, key, value) => {
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
};

// VNode'dan DOM node uretir. Hicbir yere eklemez, uretileni dondurur.
export const createDom = (vnode, doc = globalThis.document) => {
  if (vnode.type === TEXT) {
    const textNode = doc.createTextNode(vnode.value);
    vnode.el = textNode;
    return textNode;
  }

  if (vnode.type === FRAGMENT) {
    const frag = doc.createDocumentFragment();
    for (const child of vnode.children) {
      frag.appendChild(createDom(child, doc));
    }
    return frag;
  }

  const el = doc.createElement(vnode.type);
  vnode.el = el;

  for (const [key, value] of Object.entries(vnode.props)) {
    setProp(el, key, value);
  }

  for (const child of vnode.children) {
    el.appendChild(createDom(child, doc));
  }

  return el;
};

export const mount = (vnode, container, doc = globalThis.document) => {
  return container.appendChild(createDom(vnode, doc));
};
