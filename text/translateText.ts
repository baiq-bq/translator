import type { ChatOpenAI } from "@langchain/openai";
import type { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

const translateText = async (
  text: string,
  targetLang: string,
  chat: ChatOpenAI | ChatGoogleGenerativeAI,
): Promise<string> => {
  const prompt = `Translate the following text to ${targetLang}: ${text}. ` +
    "Do not include any additional text or formatting. Just return the translated text. " +
    "Text is aimed for a web application, so keep it concise and clear.";
  const response = await chat.invoke([
    new HumanMessage(prompt),
  ]);
  if (!response || !response.content) {
    throw new Error("Translation failed or returned empty content.");
  }
  if (typeof response.content !== "string") {
    throw new Error("Translation response is not a string.");
  }
  return response.content;
};

export default translateText;
