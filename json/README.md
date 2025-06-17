# `json` module

Helpers for translating values of JSON objects.

## Example

```ts
import { configureLangChain, translateJson, translateText } from "../mod.ts";

const chat = configureLangChain({
  name: "google",
  model: "gemini-1.5-flash",
  apiKey: "YOUR_GOOGLE_KEY",
});

const data = { greeting: "Hello" };
const translated = await translateJson(
  data,
  "es",
  (text, lang) => translateText(text, lang, chat),
);
console.log(translated); // { greeting: "Hola" }
```

### CLI

```sh
deno run jsr:@baiq/translator/script/translateJSON \
  --engine google \
  --model gemini-1.5-flash \
  --lang es \
  --file data.json
```
