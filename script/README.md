# `cli` directory

Command line utilities for translating text or JSON using the library.

## Translate a short text

```sh
deno run jsr:@baiq/translator/cli/translateText \
  --engine openai \
  --model gpt-4o \
  --lang es \
  --text "Hello"
```

This is also the default when running `jsr:@baiq/translator/cli`.

## Translate a JSON file

```sh
deno run jsr:@baiq/translator/cli/translateJSON \
  --engine google \
  --model gemini-1.5-flash \
  --lang fr \
  --file data.json
```
