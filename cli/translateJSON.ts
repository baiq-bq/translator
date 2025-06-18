#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read

// CLI helper that translates JSON files recursively. The API key can be passed
// via `--key` or taken from `OPENAI_API_KEY`/`GOOGLE_API_KEY`.

import { exit, getArgs, getEnv, parseCliArgs, readText } from "./runtime.ts";

import {
  configureLangChain,
  type LangChainConfig,
  translateJSON,
  translateText,
} from "../mod.ts";
import type { GoogleModel, OpenAIModel } from "../LangChainConfig.ts";
import type { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import type { ChatGoogleGenerativeAI } from "@langchain/google-genai";

let translateTextImpl = translateText;
let configureLangChainImpl = configureLangChain;

const args = parseCliArgs(getArgs()) as Record<string, string | boolean>;

if (args.testMode) {
  translateTextImpl = (text: string, lang: string) =>
    Promise.resolve(`${text}-${lang}`);
  configureLangChainImpl = (
    _cfg: LangChainConfig,
  ) => ({} as ChatOpenAI<ChatOpenAICallOptions> | ChatGoogleGenerativeAI);
}

if (!args.engine || !args.model || !args.lang || !args.file) {
  console.error(
    "Usage: deno run jsr:@baiq/translator/cli/translateJSON --engine=<openai|google> --model=<model> --lang=<lang> --file=<path-to-json-file> [--key=<api-key>]",
  );
  exit(1);
}

const apiKey = args.key ??
  getEnv(
    args.engine === "openai" ? "OPENAI_API_KEY" : "GOOGLE_API_KEY",
  ) ??
  "";

if (!apiKey) {
  console.error("API key must be provided via --key or environment variable");
  exit(1);
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

const fileContent = await readText(String(args.file));
const jsonData = JSON.parse(fileContent);

const chat = configureLangChainImpl(config);
const result = await translateJSON(
  jsonData,
  args.lang,
  (text, lang) => translateTextImpl(text, lang, chat),
);

console.log(JSON.stringify(result, null, 2));
