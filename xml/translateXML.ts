import { JSDOM } from "jsdom";
import type { Node, Element } from "jsdom";

/**
 * Recursively translate the text content of a DOM node, preserving attributes and structure.
 * If stopTag is provided, the content of that tag is translated as a block.
 */
async function translateDomNode(
  node: Node,
  targetLang: string,
  translateTextFn: (text: string, targetLang: string) => Promise<string>,
  stopTag?: string
): Promise<void> {
  if (node.nodeType === node.TEXT_NODE) {
    // Translate text nodes
    node.nodeValue = await translateTextFn(node.nodeValue ?? "", targetLang);
    return;
  }
  if (node.nodeType === node.ELEMENT_NODE) {
    const el = node as Element;
    if (stopTag && el.tagName.toLowerCase() === stopTag.toLowerCase()) {
      // Translate the inner XML as a block
      const inner = el.innerHTML;
      el.innerHTML = await translateTextFn(inner, targetLang);
      return;
    }
    // Recurse into children
    for (const child of Array.from(el.childNodes)) {
      await translateDomNode(child, targetLang, translateTextFn, stopTag);
    }
  }
}

/**
 * Translate an XML string using JSDOM, preserving attributes and structure.
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
  // Parse as XML
  const dom = new JSDOM(xml, { contentType: "text/xml" });
  const doc = dom.window.document;
  // Translate starting from the root element
  await translateDomNode(
    doc.documentElement,
    targetLang,
    translateTextFn,
    stopTag
  );
  // Serialize back to XML
  // Remove XML declaration if present
  const result = doc.documentElement.outerHTML;
  return result;
};

export default translateXML;
