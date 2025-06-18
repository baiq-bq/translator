# `cli` directory

Command line utilities for translating text, JSON, or XML using the library.

Each command reads the API key from either the command line (`--key`) or the
appropriate environment variable (`OPENAI_API_KEY` or `GOOGLE_API_KEY`). The
scripts can also be executed with Node after compilation or via `ts-node`.

## Translate a short text

```sh
deno run jsr:@baiq/translator/cli/translateText \
  --engine=openai \
  --model=gpt-4o \
  --lang=es \
  --text="Hello"
```

With Node you can run the compiled file in the same way:

```sh
node translateText.js --engine=openai --model=gpt-4o --lang=es --text "Hello"
```

This is also the default when running `jsr:@baiq/translator/cli`.

## Translate a JSON file

```sh
deno run jsr:@baiq/translator/cli/translateJSON \
  --engine=google \
  --model=gemini-1.5-flash \
  --lang=fr \
  --file=data.json
```

```sh
node translateJSON.js --engine=google --model=gemini-1.5-flash --lang=fr --file=data.json
```

## Translate an XML file

The `--stopTags` flag accepts a comma-separated list of tag names whose contents
should be translated as a single block.

```sh
deno run jsr:@baiq/translator/cli/translateXML \
  --engine=openai \
  --model=gpt-4o \
  --lang=fr \
  --file=data.xml \
  --stopTags=paragraph,note
```

```sh
node translateXML.js --engine=openai --model=gpt-4o --lang=fr --file=data.xml --stopTags=paragraph,note
```
