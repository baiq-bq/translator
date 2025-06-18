# `xml` module

Helpers for translating XML strings without any third-party DOM library.

Nested tags are handled recursively. When the specified `stopTag` is
encountered, its contents are sent as a single block for translation. You can
also specify attribute names that should be translated.

## Example

```ts
import { configureLangChain, translateText, translateXML } from "../mod.ts";

const chat = configureLangChain({
  name: "google",
  model: "gemini-1.5-flash",
  apiKey: "YOUR_GOOGLE_KEY",
});

const xml = `<figure><img alt="A cat" src="cat.jpg" /></figure>`;
const translated = await translateXML(
  xml,
  "es",
  (text, lang) => translateText(text, lang, chat),
  undefined,
  ["alt"],
);
console.log(translated);
```
