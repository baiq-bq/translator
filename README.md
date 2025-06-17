# translator

Utilities for translating plain text or the values of JSON objects using
LangChain chat models.

## Usage

First configure a LangChain chat client. The API key can be supplied directly or
via the `OPENAI_API_KEY` or `GOOGLE_API_KEY` environment variables.

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
const data = { greeting: "Hello", nested: { bye: "Goodbye" } };
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

Both commands also accept an `--key` flag for providing the API key explicitly.
