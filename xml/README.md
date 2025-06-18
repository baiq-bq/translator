# `xml` module

Helpers for translating XML strings without any third-party DOM library.

Nested tags are handled recursively. When any of the specified `stopTags` is
encountered, its contents are sent as a single block for translation. Multiple
tag names can be provided. Attributes are normally left as-is but you can
specify a list of attribute names that should be translated.

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

If you want to translate specific attributes, pass their names in the last
argument:

```ts
const html = '<img alt="Hello" src="pic.png" />';
const result = await translateXML(
  html,
  "es",
  (text, lang) => translateText(text, lang, chat),
  undefined,
  ["alt"],
);
console.log(result); // <img alt="Hola" src="pic.png" />
```
