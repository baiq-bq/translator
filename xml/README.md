# `xml` module

Helpers for translating XML strings using the
[`linkedom`](https://www.npmjs.com/package/linkedom) DOM implementation.

Nested tags are handled recursively. When the specified `stopTag` is
encountered, its contents are sent as a single block for translation.

## Example

```ts
import { configureLangChain, translateText, translateXML } from "../mod.ts";

const chat = configureLangChain({
  name: "google",
  model: "gemini-1.5-flash",
  apiKey: "YOUR_GOOGLE_KEY",
});

const xml = `<page><paragraph>Hello <line>World</line></paragraph></page>`;
const translated = await translateXML(
  xml,
  "es",
  (text, lang) => translateText(text, lang, chat),
  "paragraph",
);
console.log(translated);
```
