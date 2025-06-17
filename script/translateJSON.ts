#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read

import { parseArgs } from "@std/cli/parse-args";

import {
  configureLangChain,
  type LangChainConfig,
  translateJSON,
  translateText,
} from "../mod.ts";
import { GoogleModel, OpenAIModel } from "../LangChainConfig.ts";

const args = parseArgs(["--engine", "--model", "--lang", "--file", "--key"], {
  string: ["engine", "model", "lang", "file", "key"],
});

if (!args.engine || !args.model || !args.lang || !args.file || !args.key) {
  console.error(
    "Usage: deno run jsr:@baiq/translator/cli/translateJSON --engine <openai|google> --model <model> --lang <lang> --file <path> --key <api-key>"
  );
  Deno.exit(1);
}

const apiKey =
  args.key ??
  Deno.env.get(
    args.engine === "openai" ? "OPENAI_API_KEY" : "GOOGLE_API_KEY"
  ) ??
  "";

if (!apiKey) {
  console.error("API key must be provided via --key or environment variable");
  Deno.exit(1);
}

let config: LangChainConfig;
if (args.engine === "openai") {
  config = {
    name: "openai",
    model: args.model as OpenAIModel,
    apiKey,
  };
} else {
  config = {
    name: "google",
    model: args.model as GoogleModel,
    apiKey,
  };
}

const fileContent = await Deno.readTextFile(args.file);
const jsonData = JSON.parse(fileContent);

const chat = configureLangChain(config);
const result = await translateJSON(jsonData, args.lang, (text, lang) =>
  translateText(text, lang, chat)
);

console.log(JSON.stringify(result, null, 2));
