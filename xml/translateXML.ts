/**
 * Very small XML node representation used for translation.
 */
type TextNode = { type: "text"; text: string };
type ElementNode = { type: "element"; tag: string; children: Node[] };
type Node = TextNode | ElementNode;

// Type guard para saber si un Node es ElementNode
function isElement(node: Node): node is ElementNode {
  return node.type === "element";
}

function parseXML(xml: string): ElementNode {
  const root: ElementNode = { type: "element", tag: "__root__", children: [] };
  const stack: ElementNode[] = [root];
  const tagPattern = /<[^>]+>/g;
  let lastIndex = 0;

  for (const match of xml.matchAll(tagPattern)) {
    if (match.index === undefined) continue;

    // Añadimos el texto que hay antes de la etiqueta
    if (match.index > lastIndex) {
      const text = xml.slice(lastIndex, match.index);
      if (text) {
        stack[stack.length - 1].children.push({ type: "text", text });
      }
    }

    const tag = match[0];
    if (tag.startsWith("</")) {
      // Cierre de etiqueta
      stack.pop();
    } else if (tag.endsWith("/>")) {
      // Etiqueta auto-cerrada
      const name = tag.slice(1, -2).trim().split(/\s+/)[0];
      stack[stack.length - 1].children.push({
        type: "element",
        tag: name,
        children: [],
      });
    } else {
      // Apertura de etiqueta normal
      const name = tag.slice(1, -1).trim().split(/\s+/)[0];
      const node: ElementNode = { type: "element", tag: name, children: [] };
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    }

    lastIndex = match.index + tag.length;
  }

  // Texto restante tras la última etiqueta
  if (lastIndex < xml.length) {
    const text = xml.slice(lastIndex);
    if (text) {
      stack[stack.length - 1].children.push({ type: "text", text });
    }
  }

  return root;
}

function serialize(node: Node): string {
  if (node.type === "text") {
    return node.text;
  }
  // Sólo los ElementNode tienen children
  return node.children
    .map((child) =>
      child.type === "text"
        ? child.text
        : `<${child.tag}>${serialize(child)}</${child.tag}>`
    )
    .join("");
}

async function translateNode(
  node: Node,
  targetLang: string,
  translateTextFn: (text: string, targetLang: string) => Promise<string>,
  stopTag?: string
): Promise<void> {
  if (!isElement(node)) {
    // Si es TextNode, nada que hacer aquí
    return;
  }

  for (const child of node.children) {
    if (child.type === "text") {
      // Traducimos el texto
      child.text = await translateTextFn(child.text, targetLang);
    } else {
      // child es ElementNode
      if (stopTag && child.tag === stopTag) {
        // Si la etiqueta coincide con stopTag, traducir todo el interior de golpe
        const inner = serialize(child);
        const translated = await translateTextFn(inner, targetLang);
        child.children = [{ type: "text", text: translated }];
      } else {
        // Recurse sobre el árbol
        await translateNode(child, targetLang, translateTextFn, stopTag);
      }
    }
  }
}

/**
 *
 * @param xml The XML string to translate.
 * @param targetLang The target language to translate the XML into.
 * @param translateTextFn The function to use for translating text.
 * @param stopTag An optional tag name to stop translation at.
 * @returns The translated XML string.
 */
const translateXML = async (
  xml: string,
  targetLang: string,
  translateTextFn: (text: string, targetLang: string) => Promise<string>,
  stopTag?: string
): Promise<string> => {
  const tree = parseXML(xml);
  await translateNode(tree, targetLang, translateTextFn, stopTag);
  const body = serialize(tree);
  return `${body}`;
};

export default translateXML;
