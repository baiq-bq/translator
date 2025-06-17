#!/usr/bin/env -S deno run --allow-env --allow-net

import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
import {
  configureLangChain,
  type GoogleModel,
  type LangChainConfig,
  type OpenAIModel,
  translateText,
} from "../mod.ts";

let translateTextImpl = translateText;
let configureLangChainImpl = configureLangChain;

if (Deno.env.get("CLI_TEST_MODE")) {
  translateTextImpl = (text: string, lang: string) =>
    Promise.resolve(`${text}-${lang}`);
  configureLangChainImpl = (_cfg: LangChainConfig) => ({} as unknown);
}

const args = parse(Deno.args, {
  string: ["engine", "model", "lang", "text", "key"],
  alias: { e: "engine", m: "model", l: "lang", t: "text", k: "key" },
});

if (!args.engine || !args.model || !args.lang || !args.text) {
  console.error(
    "Usage: deno run jsr:@baiq/translator/cli/translateText --engine <openai|google> --model <model> --lang <lang> --text <text> [--key <api-key>]"
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

const chat = configureLangChainImpl(config);
const result = await translateTextImpl(args.text, args.lang, chat);
console.log(result);
