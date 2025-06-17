# `text` module

Single text translation helper.

## Example

```ts
import { configureLangChain, translateText } from "../mod.ts";

const chat = configureLangChain({
  name: "openai",
  model: "gpt-4o",
  apiKey: "YOUR_OPENAI_KEY",
});

const greeting = await translateText("Hello", "de", chat);
console.log(greeting); // Hallo
```

### CLI

```sh
deno run jsr:@baiq/translator/script/translateText \
  --engine openai \
  --model gpt-4o \
  --lang de \
  --text "Hello"
```
