# translator

Utilities for translating plain text, JSON, or XML content using LangChain chat
models.

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

### XML translation

```ts
const xml = `<page><paragraph><line>Hello</line></paragraph></page>`;
const translatedXml = await translateXML(
  xml,
  "fr",
  (text, lang) => translateText(text, lang, chat),
  ["paragraph", "note"],
);
console.log(translatedXml);
```

To translate attributes such as `alt` in HTML, pass the attribute names as the
last argument:

```ts
const html = '<img alt="Hello" src="pic.png" />';
const translatedHtml = await translateXML(
  html,
  "fr",
  (text, lang) => translateText(text, lang, chat),
  undefined,
  ["alt"],
);
console.log(translatedHtml);
```

### CLI usage

Translate a short text directly from the command line:

```sh
deno run jsr:@baiq/translator/cli/translateText \
  --engine=openai \
  --model=gpt-4o \
  --lang=fr \
  --text="Hello"
```

When running in Node, execute the compiled script (or use `ts-node`) with the
same flags:

```sh
node cli/translateText.js --engine=openai --model=gpt-4o --lang=fr --text "Hello"
```

You can also translate a JSON file:

```sh
deno run jsr:@baiq/translator/cli/translateJSON \
  --engine=google \
  --model=gemini-1.5-flash \
  --lang=fr \
  --file=data.json
```

You can also translate an XML file:

```sh
deno run jsr:@baiq/translator/cli/translateXML \
  --engine=openai \
  --model=gpt-4o \
  --lang=fr \
  --file=page.xml \
  --stopTags=paragraph,note
```

Both commands also accept an `--key` flag for providing the API key explicitly.
The scripts behave the same when run under Node.
