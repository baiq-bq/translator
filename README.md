# translator

Utilities for translating text or JSON data using LangChain chat models.

## Usage

```ts
import { configureLangChain, translateJSON, translateText } from "./mod.ts";

const chat = configureLangChain({
  name: "openai",
  model: "gpt-4o",
  apiKey: "YOUR_OPENAI_KEY",
});

const result = await translateText("Hello", "fr", chat);
console.log(result); // Bonjour
```

### JSON translation

```ts
const data = { greeting: "Hello", nested: { bye: "Good bye" } };
const translated = await translateJSON(
  data,
  "fr",
  (text, lang) => translateText(text, lang, chat),
);
console.log(translated);
// { greeting: "Bonjour", nested: { bye: "Au revoir" } }
```

### CLI usage

Translate a short text directly from the command line:

```sh
deno run jsr:@baiq/translator/cli/translateText \
  --engine openai \
  --model gpt-4o \
  --lang fr \
  --text "Hello"
```

You can also translate a JSON file:

```sh
deno run jsr:@baiq/translator/cli/translateJSON \
  --engine google \
  --model gemini-1.5-flash \
  --lang fr \
  --file data.json
```
