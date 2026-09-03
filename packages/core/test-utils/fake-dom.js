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
      node.parentNode = this;
      this.childNodes.push(node);
      return node;
    },
    removeChild(node) {
      const i = this.childNodes.indexOf(node);
      if (i === -1) throw new Error("removeChild: node bulunamadi");
      this.childNodes.splice(i, 1);
      node.parentNode = null;
      return node;
    },
    replaceChild(yeni, eski) {
      const i = this.childNodes.indexOf(eski);
      if (i === -1) throw new Error("replaceChild: eski node bulunamadi");
      this.childNodes[i] = yeni;
      yeni.parentNode = this;
      eski.parentNode = null;
      return eski;
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
      const frag = createFakeNode();
      frag.nodeType = "fragment";
      return frag;
    },
  };
}
