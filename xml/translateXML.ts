/**
 * Very small XML node representation used for translation.
 */
type Node =
  | { type: "text"; text: string }
  | { type: "element"; tag: string; children: Node[] };

function parseXML(xml: string): Node {
  const root: Node = { type: "element", tag: "__root__", children: [] };
  const stack: Node[] = [root];
  const tagPattern = /<[^>]+>/g;
  let lastIndex = 0;
  for (const match of xml.matchAll(tagPattern)) {
    if (match.index === undefined) continue;
    if (match.index > lastIndex) {
      const text = xml.slice(lastIndex, match.index);
      if (text) stack[stack.length - 1].children.push({ type: "text", text });
    }
    const tag = match[0];
    if (tag.startsWith("</")) {
      stack.pop();
    } else if (tag.endsWith("/>")) {
      const name = tag.slice(1, -2).trim().split(/\s+/)[0];
      stack[stack.length - 1].children.push({
        type: "element",
        tag: name,
        children: [],
      });
    } else {
      const name = tag.slice(1, -1).trim().split(/\s+/)[0];
      const node: Node = { type: "element", tag: name, children: [] };
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    }
    lastIndex = match.index + tag.length;
  }
  if (lastIndex < xml.length) {
    const text = xml.slice(lastIndex);
    if (text) stack[stack.length - 1].children.push({ type: "text", text });
  }
  return root;
}

function serialize(node: Node): string {
  if (node.type === "text") return node.text;
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
  stopTag?: string,
): Promise<void> {
  for (const child of node.children ?? []) {
    if (child.type === "text") {
      child.text = await translateTextFn(child.text, targetLang);
    } else {
      if (stopTag && child.tag === stopTag) {
        const inner = serialize(child);
        const translated = await translateTextFn(inner, targetLang);
        child.children = [{ type: "text", text: translated }];
      } else {
        await translateNode(child, targetLang, translateTextFn, stopTag);
      }
    }
  }
}

const translateXML = async (
  xml: string,
  targetLang: string,
  translateTextFn: (text: string, targetLang: string) => Promise<string>,
  stopTag?: string,
): Promise<string> => {
  const tree = parseXML(xml);
  await translateNode(tree, targetLang, translateTextFn, stopTag);
  const body = serialize(tree);
  return `<?xml version="1.0" encoding="utf-8"?>${body}`;
};

export default translateXML;
