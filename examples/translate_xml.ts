import { configureLangChain, translateText, translateXML } from "../mod.ts";

// Example: translate an XML file using OpenAI. Requires OPENAI_API_KEY to be
// set in the environment.

const chat = configureLangChain({
  name: "openai",
  model: "gpt-4o",
  apiKey: Deno.env.get("OPENAI_API_KEY") ?? "", // replace with your key
});

// Path to the XML file you want to translate.
const xml = await Deno.readTextFile("data.xml");

const translated = await translateXML(
  xml,
  "fr",
  (text, lang) => translateText(text, lang, chat),
);
console.log(translated);
