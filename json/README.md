# `json` module

Helpers for translating values of JSON objects.

Nested objects and arrays are handled recursively and non-string values are left
untouched.

## Example

```ts
import { configureLangChain, translateJSON, translateText } from "../mod.ts";

const chat = configureLangChain({
  name: "google",
  model: "gemini-1.5-flash",
  apiKey: "YOUR_GOOGLE_KEY", // or use GOOGLE_API_KEY env var
});

const data = { greeting: "Hello" };
const translated = await translateJSON(
  data,
  "es",
  (text, lang) => translateText(text, lang, chat),
);
console.log(translated); // { greeting: "Hola" }
```

### CLI

```sh
deno run jsr:@baiq/translator/cli/translateJSON \
  --engine google \
  --model gemini-1.5-flash \
  --lang es \
  --file data.json
```

If no `--key` option is provided the command reads `GOOGLE_API_KEY` or
`OPENAI_API_KEY` from the environment, depending on the selected engine.
