import { createText, createElement } from "./vnode.js";

export const h = (type, props = {}, children = []) => {
  children = children.flat(Infinity);
  const { key, ...otherProps } = props;
  children = children.filter(
    (child) => child !== null && child !== undefined && child !== false,
  );

  const normalized = children.map((child) =>
    typeof child === "string" || typeof child === "number"
      ? createText(child)
      : child,
  );
  return createElement(type, otherProps, normalized, key);
};
