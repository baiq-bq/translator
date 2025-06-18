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

const rawArgs = parseCliArgs(getArgs()) as Record<string, string | boolean>;

const engine = typeof rawArgs.engine === "string" ? rawArgs.engine : "";
const model = typeof rawArgs.model === "string" ? rawArgs.model : "";
const lang = typeof rawArgs.lang === "string" ? rawArgs.lang : "";
const text = typeof rawArgs.text === "string" ? rawArgs.text : "";
const keyArg = typeof rawArgs.key === "string" ? rawArgs.key : undefined;

if (rawArgs.testMode) {
  translateTextImpl = (text: string, lang: string) =>
    Promise.resolve(`${text}-${lang}`);
  configureLangChainImpl = (
    _cfg: LangChainConfig,
  ) => ({} as ChatOpenAI<ChatOpenAICallOptions> | ChatGoogleGenerativeAI);
}

if (!engine || !model || !lang || !text) {
  console.error(
    "Usage: deno run jsr:@baiq/translator/cli/translateText --engine=<openai|google> --model=<model> --lang=<lang> --text=<text> [--key=<api-key>]",
  );
  exit(1);
}

const apiKey = keyArg ??
  getEnv(
    engine === "openai" ? "OPENAI_API_KEY" : "GOOGLE_API_KEY",
  ) ??
  "";

if (!apiKey) {
  console.error("API key must be provided via --key or environment variable");
  exit(1);
}

let config: LangChainConfig;
if (engine === "openai") {
  config = {
    name: "openai",
    model: model as OpenAIModel,
    apiKey,
  };
} else {
  config = {
    name: "google",
    model: model as GoogleModel,
    apiKey,
  };
}

const chat = configureLangChainImpl(config);
const result = await translateTextImpl(text, lang, chat);
console.log(result);
