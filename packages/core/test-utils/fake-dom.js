export function createFakeNode(tag) {
  return {
    tagName: tag,
    parentNode: null,
    childNodes: [],
    attributes: {},
    style: {},
    listeners: {},
    appendChild(node) {
      if (node.nodeType === "fragment") {
        for (const child of node.childNodes) child.parentNode = this;
        this.childNodes.push(...node.childNodes);
        node.childNodes = [];
        return node;
      }
      if (node.parentNode) {
        const currentIndex = node.parentNode.childNodes.indexOf(node);
        if (currentIndex !== -1) {
          node.parentNode.childNodes.splice(currentIndex, 1);
        }
      }
      node.parentNode = this;
      this.childNodes.push(node);
      return node;
    },
    insertBefore(newNode, referenceNode) {
      if (referenceNode === newNode) {
        const index = this.childNodes.indexOf(newNode);
        referenceNode = this.childNodes[index + 1] ?? null;
      }
      if (newNode.parentNode) {
        const currentIndex = newNode.parentNode.childNodes.indexOf(newNode);
        if (currentIndex !== -1) {
          newNode.parentNode.childNodes.splice(currentIndex, 1);
        }
      }
      const index =
        referenceNode == null
          ? this.childNodes.length
          : this.childNodes.indexOf(referenceNode);
      if (index === -1) {
        throw new Error("insertBefore: reference node not found");
      }
      this.childNodes.splice(index, 0, newNode);
      newNode.parentNode = this;
      return newNode;
    },
    removeChild(node) {
      const index = this.childNodes.indexOf(node);
      if (index === -1) throw new Error("removeChild: node not found");
      this.childNodes.splice(index, 1);
      node.parentNode = null;
      return node;
    },
    replaceChild(newNode, oldNode) {
      const index = this.childNodes.indexOf(oldNode);
      if (index === -1) throw new Error("replaceChild: old node not found");
      this.childNodes[index] = newNode;
      newNode.parentNode = this;
      oldNode.parentNode = null;
      return oldNode;
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    removeAttribute(name) {
      delete this.attributes[name];
    },
    addEventListener(type, handler) {
      this.listeners[type] ??= [];
      this.listeners[type].push(handler);
    },
  };
}

export function createFakeDocument() {
  return {
    createTextNode(value) {
      return { nodeType: "text", nodeValue: String(value), parentNode: null };
    },
    createElement(tag) {
      return createFakeNode(tag);
    },
    createDocumentFragment() {
      const fragment = createFakeNode();
      fragment.nodeType = "fragment";
      return fragment;
    },
  };
}
