import { JSDOM } from "jsdom";
import type { Element, Node } from "jsdom";

/**
 * Recursively translate the text content of a DOM node, preserving attributes and
 * structure. If `stopTags` are provided, the contents of those tags are
 * translated as a block. Selected attributes can be translated as well.
 */
async function translateDomNode(
  node: Node,
  targetLang: string,
  translateTextFn: (text: string, targetLang: string) => Promise<string>,
  stopTags?: string[],
  attributesToTranslate?: string[]
): Promise<void> {
  if (node.nodeType === node.TEXT_NODE) {
    // Translate text nodes
    node.nodeValue = await translateTextFn(node.nodeValue ?? "", targetLang);
    return;
  }
  if (node.nodeType === node.ELEMENT_NODE) {
    const el = node as Element;

    // Translate specified attributes using standard DOM APIs
    if (attributesToTranslate) {
      for (const attrName of attributesToTranslate) {
        if (el.hasAttribute(attrName)) {
          const originalValue = el.getAttribute(attrName) ?? "";
          const translatedValue = await translateTextFn(
            originalValue,
            targetLang
          );
          el.setAttribute(attrName, translatedValue);
        }
      }
    }

    // If this tag is in stopTags, translate its entire innerHTML as a block
    if (
      stopTags?.some((tag) => tag.toLowerCase() === el.tagName.toLowerCase())
    ) {
      const inner = el.innerHTML;
      el.innerHTML = await translateTextFn(inner, targetLang);
      return;
    }

    // Recurse into child nodes
    for (const child of Array.from(el.childNodes)) {
      await translateDomNode(
        child,
        targetLang,
        translateTextFn,
        stopTags,
        attributesToTranslate
      );
    }
  }
}

/**
 * Translate an XML string using JSDOM, preserving attributes and structure.
 * @param xml The XML string to translate.
 * @param targetLang The target language to translate the XML into.
 * @param translateTextFn The function to use for translating text.
 * @param stopTags Optional tag names to stop translation at.
 * @param attributesToTranslate Optional attribute names that should be
 *   translated when encountered.
 * @returns The translated XML string.
 */
const translateXML = async (
  xml: string,
  targetLang: string,
  translateTextFn: (text: string, targetLang: string) => Promise<string>,
  stopTags?: string[],
  attributesToTranslate?: string[]
): Promise<string> => {
  // Parse as XML
  const dom = new JSDOM(xml, { contentType: "text/xml" });
  const doc = dom.window.document;

  // Translate starting from the root element
  await translateDomNode(
    doc.documentElement,
    targetLang,
    translateTextFn,
    stopTags,
    attributesToTranslate
  );

  // Serialize back to XML
  // Remove XML declaration if present by using outerHTML
  return doc.documentElement.outerHTML;
};

export default translateXML;
