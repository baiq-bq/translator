# translator

Utilities for translating text or JSON data using LangChain chat models.

## Usage

```ts
import { configureLangChain, translateJson, translateText } from "./mod.ts";

const chat = configureLangChain({
  name: "openai",
  model: "gpt-3.5-turbo",
  apiKey: "YOUR_OPENAI_KEY",
});

const result = await translateText("Hello", "fr", chat);
console.log(result); // Bonjour
```

### JSON translation

```ts
const data = { greeting: "Hello", nested: { bye: "Good bye" } };
const translated = await translateJson(
  data,
  "fr",
  (text, lang) => translateText(text, lang, chat),
);
console.log(translated);
// { greeting: "Bonjour", nested: { bye: "Au revoir" } }
```
