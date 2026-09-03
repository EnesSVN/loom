export const TEXT = Symbol("TEXT");
export const FRAGMENT = Symbol("FRAGMENT");

export function createText(value) {
  return {
    type: TEXT,
    value,
  };
}

export function createElement(type, props = {}, children = [], key) {
  return {
    type,
    props,
    children,
    key,
  };
}

export function createFragment(children = []) {
  return {
    type: FRAGMENT,
    children,
  };
}
