import { DOMParser } from "deno-dom";

/**
 * Recursively translate the text content of an XML string.
 */
const translateXML = async (
  xml: string,
  targetLang: string,
  translateTextFn: (text: string, targetLang: string) => Promise<string>,
  stopTag?: string,
): Promise<string> => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const document = doc as unknown as Node;

  async function translateNode(node: Node): Promise<void> {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3) {
        child.nodeValue = await translateTextFn(
          child.nodeValue ?? "",
          targetLang,
        );
      } else if (child.nodeType === 1) {
        const element = child as Element;
        if (stopTag && element.tagName === stopTag) {
          const inner = element.innerHTML;
          const translated = await translateTextFn(inner, targetLang);
          element.innerHTML = translated;
        } else {
          await translateNode(element);
        }
      }
    }
  }

  await translateNode(document);
  return document.toString();
};

export default translateXML;
