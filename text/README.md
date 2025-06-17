# `text` module

Single text translation helper.

The translation is performed via a LangChain chat model which requires an API
key. Use the `OPENAI_API_KEY` environment variable or pass it directly when
configuring the client.

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
deno run jsr:@baiq/translator/cli/translateText \
  --engine openai \
  --model gpt-4o \
  --lang de \
  --text "Hello"
```

`--key` can be used to provide the API key on the command line instead of via
the environment.
