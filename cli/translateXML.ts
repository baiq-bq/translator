#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read

// CLI helper that translates XML files recursively. The API key can be provided
// via --key or read from OPENAI_API_KEY/GOOGLE_API_KEY.

import { exit, getArgs, getEnv, parseCliArgs, readText } from "./runtime.ts";

import {
  configureLangChain,
  type LangChainConfig,
  translateText,
  translateXML,
} from "../mod.ts";
import type { GoogleModel, OpenAIModel } from "../LangChainConfig.ts";
import type { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import type { ChatGoogleGenerativeAI } from "@langchain/google-genai";

let translateTextImpl = translateText;
let configureLangChainImpl = configureLangChain;

const rawArgs = parseCliArgs(getArgs()) as Record<string, string | boolean>;

const engine = typeof rawArgs.engine === "string" ? rawArgs.engine : "";
const model = typeof rawArgs.model === "string" ? rawArgs.model : "";
const lang = typeof rawArgs.lang === "string" ? rawArgs.lang : "";
const file = typeof rawArgs.file === "string" ? rawArgs.file : "";
const keyArg = typeof rawArgs.key === "string" ? rawArgs.key : undefined;

if (rawArgs.testMode) {
  translateTextImpl = (text: string, lang: string) =>
    Promise.resolve(`${text}-${lang}`);
  configureLangChainImpl = (
    _cfg: LangChainConfig,
  ) => ({} as ChatOpenAI<ChatOpenAICallOptions> | ChatGoogleGenerativeAI);
}

if (!engine || !model || !lang || !file) {
  console.error(
    "Usage: deno run jsr:@baiq/translator/cli/translateXML --engine=<openai|google> --model=<model> --lang=<lang> --file=<path-to-xml-file> [--stopTags=<tag1,tag2>] [--key=<api-key>]",
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

const xml = await readText(file);
const chat = configureLangChainImpl(config);
const stopTags = rawArgs.stopTags
  ? String(rawArgs.stopTags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
  : rawArgs.stopTag
  ? [String(rawArgs.stopTag)]
  : undefined;
const result = await translateXML(
  xml,
  lang,
  (text, lang) => translateTextImpl(text, lang, chat),
  stopTags,
);

console.log(result);
