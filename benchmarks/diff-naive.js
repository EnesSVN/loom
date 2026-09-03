import { h, mount, patch } from "@loom/core";

function createSayacDoc() {
  const sayac = {
    createElement: 0,
    createTextNode: 0,
    setAttribute: 0,
    appendChild: 0,
    removeChild: 0,
    replaceChild: 0,
    metinGuncelleme: 0,
  };

  const yeniNode = (tag) => ({
    tagName: tag,
    parentNode: null,
    childNodes: [],
    attributes: {},
    style: {},
    appendChild(child) {
      sayac.appendChild++;
      child.parentNode = this;
      this.childNodes.push(child);
      return child;
    },
    removeChild(child) {
      sayac.removeChild++;
      this.childNodes.splice(this.childNodes.indexOf(child), 1);
      child.parentNode = null;
      return child;
    },
    replaceChild(yeni, eski) {
      sayac.replaceChild++;
      this.childNodes[this.childNodes.indexOf(eski)] = yeni;
      yeni.parentNode = this;
      return eski;
    },
    setAttribute(name, value) {
      sayac.setAttribute++;
      this.attributes[name] = value;
    },
    removeAttribute(name) {
      delete this.attributes[name];
    },
    addEventListener() {},
  });

  const doc = {
    createElement(tag) {
      sayac.createElement++;
      return yeniNode(tag);
    },
    createTextNode(value) {
      sayac.createTextNode++;
      const node = { nodeType: "text", parentNode: null };
      let icerik = String(value);
      Object.defineProperty(node, "nodeValue", {
        get: () => icerik,
        set: (v) => {
          sayac.metinGuncelleme++;
          icerik = String(v);
        },
      });
      return node;
    },
    createDocumentFragment() {
      const frag = yeniNode();
      frag.nodeType = "fragment";
      return frag;
    },
  };

  return { doc, sayac };
}

const N = 1000;
const liste = (items) =>
  h(
    "ul",
    {},
    items.map((i) => h("li", {}, [String(i)])),
  );
const sayilar = Array.from({ length: N }, (_, i) => i);

function olc(baslik, yeniListe) {
  const { doc, sayac } = createSayacDoc();
  const container = {
    childNodes: [],
    appendChild(n) {
      this.childNodes.push(n);
      n.parentNode = this;
      return n;
    },
  };

  const eski = liste(sayilar);
  mount(eski, container, doc);

  for (const k of Object.keys(sayac)) sayac[k] = 0;

  const yeni = liste(yeniListe);
  patch(eski, yeni, doc);

  const toplam = Object.values(sayac).reduce((a, b) => a + b, 0);
  console.log(`\n${baslik}`);
  console.log(`  toplam DOM islemi : ${toplam}`);
  for (const [k, v] of Object.entries(sayac)) {
    if (v > 0) console.log(`    ${k.padEnd(18)}: ${v}`);
  }
}

console.log(`Naive diff — ${N} elemanli liste`);
olc("Sona ekleme  [0..999] -> [0..999, 'yeni']", [...sayilar, "yeni"]);
olc("Basa ekleme  [0..999] -> ['yeni', 0..999]", ["yeni", ...sayilar]);
