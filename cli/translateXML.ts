#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read

// CLI helper that translates XML files recursively. The API key can be provided
// via --key or read from OPENAI_API_KEY/GOOGLE_API_KEY.

import { parseArgs } from "@std/cli/parse-args";

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

const args = parseArgs(Deno.args, {
  string: ["engine", "model", "lang", "file", "stopTag", "stopTags", "key"],
  boolean: ["testMode"],
});

if (args.testMode) {
  translateTextImpl = (text: string, lang: string) =>
    Promise.resolve(`${text}-${lang}`);
  configureLangChainImpl = (
    _cfg: LangChainConfig,
  ) => ({} as ChatOpenAI<ChatOpenAICallOptions> | ChatGoogleGenerativeAI);
}

if (!args.engine || !args.model || !args.lang || !args.file) {
  console.error(
    "Usage: deno run jsr:@baiq/translator/cli/translateXML --engine=<openai|google> --model=<model> --lang=<lang> --file=<path-to-xml-file> [--stopTags=<tag1,tag2>] [--key=<api-key>]",
  );
  Deno.exit(1);
}

const apiKey = args.key ??
  Deno.env.get(
    args.engine === "openai" ? "OPENAI_API_KEY" : "GOOGLE_API_KEY",
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

const xml = await Deno.readTextFile(args.file);
const chat = configureLangChainImpl(config);
const stopTags = args.stopTags
  ? String(args.stopTags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
  : args.stopTag
  ? [String(args.stopTag)]
  : undefined;
const result = await translateXML(
  xml,
  args.lang,
  (text, lang) => translateTextImpl(text, lang, chat),
  stopTags,
);

console.log(result);
