export const TEXT = Symbol("TEXT");
export const FRAGMENT = Symbol("FRAGMENT");

export function createText(value) {
  return {
    type: TEXT,
    value,
  };
}

export function createElement(type, props = {}, children = []) {
  return {
    type,
    props,
    children,
  };
}

export function createFragment(children = []) {
  return {
    type: FRAGMENT,
    children,
  };
}
