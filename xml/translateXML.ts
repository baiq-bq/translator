import { DOMParser, XMLSerializer } from "npm:linkedom";

/**
 * Recursively translate the text content of an XML string.
 *
 * @param xml The XML content to translate.
 * @param targetLang ISO language code to translate to.
 * @param translateTextFn Function used to translate text segments.
 * @param stopTag When encountered, the content inside this tag will be sent as a
 *   whole to the translator without further recursion.
 * @returns The translated XML as string.
 */
const translateXML = async (
  xml: string,
  targetLang: string,
  translateTextFn: (text: string, targetLang: string) => Promise<string>,
  stopTag?: string,
): Promise<string> => {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const { document } = parser.parseFromString(xml, "application/xml");

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
          const inner = Array.from(element.childNodes).map((n) =>
            serializer.serializeToString(n)
          ).join("");
          const translated = await translateTextFn(inner, targetLang);
          while (element.firstChild) element.removeChild(element.firstChild);
          element.appendChild(document.createTextNode(translated));
        } else {
          await translateNode(element);
        }
      }
    }
  }

  await translateNode(document);
  return serializer.serializeToString(document);
};

export default translateXML;
