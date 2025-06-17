import type { ChatOpenAI } from "@langchain/openai";
import type { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

/**
 * Translate a text string using a provided LangChain chat client.
 *
 * @param text The text to translate.
 * @param targetLang ISO code of the language the text should be translated to.
 * @param chat A configured chat client from {@link configureLangChain}.
 * @returns The translated text.
 *
 * @example
 * ```ts
 * const chat = configureLangChain({
 *   name: "openai",
 *   model: "gpt-3.5-turbo",
 *   apiKey: "YOUR_API_KEY",
 * });
 * const translated = await translateText("Hello", "fr", chat);
 * console.log(translated); // Bonjour
 * ```
 */

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
