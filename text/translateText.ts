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
  chat: ChatOpenAI | ChatGoogleGenerativeAI
): Promise<string> => {
  const prompt = [
    `You are a professional translator.`,
    `Translate and adapt the following text into ${targetLang}`,
    `Preserve any HTML, Markdown, XML or JSON structures exactly as in the original.`,
    `Do not add any extra text, explanations, or comments.`,
    `If the text contains JSON, return only the translated JSON. Ensure it is syntactically valid and properly escaped, without wrapping it in backticks.`,
    `If the text contains Markdown, XML or HTML, preserve the structure exactly as in the original — do not wrap it in code blocks or add backticks.`,
    `If the text is a single word or phrase, translate it directly without additional context.`,
    `Keep a similar length to the original while adapting the wording.`,
    "",
    `${text}`,
  ].join("\n");

  const response = await chat.invoke([new HumanMessage(prompt)]);
  if (!response || !response.content) {
    throw new Error("Translation failed or returned empty content.");
  }
  if (typeof response.content !== "string") {
    throw new Error("Translation response is not a string.");
  }
  return response.content;
};

export default translateText;
