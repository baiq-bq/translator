#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read

import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
import {
  configureLangChain,
  type GoogleModel,
  type LangChainConfig,
  type OpenAIModel,
  translateJson,
  translateText,
} from "../mod.ts";

const args = parse(Deno.args, {
  string: ["engine", "model", "lang", "file", "key"],
  alias: { e: "engine", m: "model", l: "lang", f: "file", k: "key" },
});

if (!args.engine || !args.model || !args.lang || !args.file) {
  console.error(
    "Usage: deno run jsr:@baiq/translator/script/translateJSON --engine <openai|google> --model <model> --lang <lang> --file <path> [--key <api-key>]",
  );
  Deno.exit(1);
}

const apiKey = args.key ??
  Deno.env.get(
    args.engine === "openai" ? "OPENAI_API_KEY" : "GOOGLE_API_KEY",
  ) ?? "";

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
const result = await translateJson(
  jsonData,
  args.lang,
  (text, lang) => translateText(text, lang, chat),
);

console.log(JSON.stringify(result, null, 2));
