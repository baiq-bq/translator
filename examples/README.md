# Examples

These small clis demonstrate how to use the library.

Run them with Deno after setting the appropriate API key in your environment.
The examples rely on the `OPENAI_API_KEY` or `GOOGLE_API_KEY` variables.

```sh
deno run -A examples/translate_text.ts
```

Alternatively use the bundled CLI to translate text:

```sh
deno run jsr:@baiq/translator/cli/translateText \
  --engine openai \
  --model gpt-4o \
  --lang fr \
  --text "Hello"
```

Both CLI examples accept `--key` to override the API key on the command line.

You can also translate JSON files:

```sh
deno run jsr:@baiq/translator/cli/translateJSON \
  --engine google \
  --model gemini-1.5-flash \
  --lang fr \
  --file data.json
```

You can also translate XML files:

```sh
deno run -A examples/translate_xml.ts
```

To translate specific HTML attributes, try the following example which
translates the `alt` attribute:

```sh
deno run -A examples/translate_html_alt.ts
```
