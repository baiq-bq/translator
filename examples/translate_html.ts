import { configureLangChain, translateText, translateXML } from "../mod.ts";

// Example: translate an HTML snippet and also translate the alt attribute.
// Requires OPENAI_API_KEY to be set in the environment.

const chat = configureLangChain({
  name: "openai",
  model: "gpt-4o",
  apiKey: Deno.env.get("OPENAI_API_KEY") ?? "", // replace with your key
});

const html = "<img alt='A cute cat' src='cat.jpg'><p>Hello world</p>";

const translated = await translateXML(
  html,
  "es",
  (text, lang) => translateText(text, lang, chat),
  undefined,
  ["alt"],
);
console.log(translated);
