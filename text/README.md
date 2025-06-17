# `text` module

Single text translation helper.

## Example

```ts
import { configureLangChain, translateText } from "../mod.ts";

const chat = configureLangChain({
  name: "openai",
  model: "gpt-3.5-turbo",
  apiKey: "YOUR_OPENAI_KEY",
});

const greeting = await translateText("Hello", "de", chat);
console.log(greeting); // Hallo
```
