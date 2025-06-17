# `cli` directory

Command line utilities for translating text or JSON using the library.

Each command reads the API key from either the command line (`--key`) or the
appropriate environment variable (`OPENAI_API_KEY` or `GOOGLE_API_KEY`).

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
