import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

if (!OPENAI_API_KEY) {
  throw new Error("Please set the OPENAI_API_KEY environment variable.");
}

const chat = new ChatOpenAI({
  openAIApiKey: OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
});

export async function translateText(
  text: string,
  targetLang: string,
): Promise<string> {
  const response = await chat.call([
    new HumanMessage(`Translate the following text to ${targetLang}: ${text}
      Do not include any additional text or formatting. Just return the translated text.
      Text is aimed for a web application, so keep it concise and clear.`),
  ]);
  if (!response || !response.content) {
    throw new Error("Translation failed or returned empty content.");
  }
  if (typeof response.content !== "string") {
    throw new Error("Translation response is not a string.");
  }
  return response.content;
}

export type JSONObject = {
  [key: string]:
    | string
    | number
    | boolean
    | Array<JSONObject | string | number | boolean>
    | JSONObject;
};

export async function translateJson(
  json: JSONObject,
  targetLang: string,
): Promise<JSONObject> {
  const result: JSONObject = {};

  for (const [key, value] of Object.entries(json)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[key] = await translateJson(value as JSONObject, targetLang);
      continue;
    } else if (Array.isArray(value)) {
      result[key] = await Promise.all(
        value.map(async (item) => {
          if (typeof item === "string") {
            return await translateText(item, targetLang);
          } else if (typeof item === "object" && item !== null) {
            return await translateJson(item as JSONObject, targetLang);
          } else {
            return item;
          }
        }),
      );
    } else if (typeof value === "string") {
      result[key] = await translateText(value, targetLang);
    } else if (typeof value === "number" || typeof value === "boolean") {
      result[key] = value;
    } else {
      result[key] = value;
    }
  }

  return result;
}
