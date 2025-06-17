import { configureLangChain, translateJSON, translateText } from "../mod.ts";

// Example: translate a JSON object using Google's Gemini. Requires
// GOOGLE_API_KEY to be set in the environment.

const chat = configureLangChain({
  name: "google",
  model: "gemini-1.5-flash",
  apiKey: Deno.env.get("GOOGLE_API_KEY") ?? "", // replace with your key
});

const data = { welcome: "Hello", nested: { bye: "Goodbye" } };
const translated = await translateJSON(
  data,
  "fr",
  (text, lang) => translateText(text, lang, chat),
);
console.log(JSON.stringify(translated, null, 2));
