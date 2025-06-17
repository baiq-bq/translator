import { configureLangChain, translateJson, translateText } from "../mod.ts";

const chat = configureLangChain({
  name: "google",
  model: "gemini-1.5-flash",
  apiKey: Deno.env.get("GOOGLE_API_KEY") ?? "", // replace with your key
});

const data = { welcome: "Hello", nested: { bye: "Good bye" } };
const translated = await translateJson(
  data,
  "fr",
  (text, lang) => translateText(text, lang, chat),
);
console.log(JSON.stringify(translated, null, 2));
