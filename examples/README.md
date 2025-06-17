# Examples

These small scripts demonstrate how to use the library.

Run them with Deno after setting the appropriate API key in your environment:

```sh
deno run -A examples/translate_text.ts
```

Alternatively use the bundled CLI to translate text:

```sh
deno run jsr:@baiq/translator/script/translateText \
  --engine openai \
  --model gpt-4o \
  --lang fr \
  --text "Hello"
```

You can also translate JSON files:

```sh
deno run jsr:@baiq/translator/script/translateJSON \
  --engine google \
  --model gemini-1.5-flash \
  --lang fr \
  --file data.json
```
