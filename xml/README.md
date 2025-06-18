# `xml` module

Helpers for translating XML strings without any third-party DOM library.

Nested tags are handled recursively. When any of the specified `stopTags` is
encountered, its contents are sent as a single block for translation. Multiple
tag names can be provided.

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
  ["paragraph", "note"],
);
console.log(translated);
```
