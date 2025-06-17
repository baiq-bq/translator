import { configureLangChain, translateText } from "../mod.ts";

const chat = configureLangChain({
  name: "openai",
  model: "gpt-4o",
  apiKey: Deno.env.get("OPENAI_API_KEY") ?? "", // replace with your key
});

const text = await translateText("Good morning", "fr", chat);
console.log(text);
