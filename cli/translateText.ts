#!/usr/bin/env -S deno run --allow-env --allow-net

// Command line utility for translating a short text snippet. API keys are read
// from `OPENAI_API_KEY` or `GOOGLE_API_KEY` unless provided via `--key`.

import { exit, getArgs, getEnv, parseCliArgs } from "./runtime.ts";
import {
  configureLangChain,
  type GoogleModel,
  type LangChainConfig,
  type OpenAIModel,
  translateText,
} from "../mod.ts";
import type { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";

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

if (!args.engine || !args.model || !args.lang || !args.text) {
  console.error(
    "Usage: deno run jsr:@baiq/translator/cli/translateText --engine=<openai|google> --model=<model> --lang=<lang> --text=<text> [--key=<api-key>]",
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

const chat = configureLangChainImpl(config);
const result = await translateTextImpl(args.text, args.lang, chat);
console.log(result);
