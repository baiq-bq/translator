import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Configuration options for creating a LangChain chat client.
 *
 * The API key must be provided explicitly instead of relying on
 * environment variables. This allows consumers of the module to pass the
 * credentials directly.
 */
export type LangChainConfig =
  | { name: "openai"; model: "gpt-3.5-turbo" | "gpt-4"; apiKey: string }
  | { name: "google"; model: "gemini-1.5-pro"; apiKey: string };

/**
 * Create a chat instance for the selected AI provider.
 *
 * @param aiEngine Configuration describing the provider, model and API key.
 * @returns An initialized chat client ready to be used with the translation
 *   helpers.
 *
 * @example
 * ```ts
 * import { configureLangChain } from "@baiq/translator";
 * const chat = configureLangChain({
 *   name: "openai",
 *   model: "gpt-3.5-turbo",
 *   apiKey: "YOUR_API_KEY",
 * });
 * ```
 */
export const configureLangChain = (
  aiEngine: LangChainConfig,
): ChatOpenAI | ChatGoogleGenerativeAI => {
  switch (aiEngine.name) {
    case "openai":
      return new ChatOpenAI({
        openAIApiKey: aiEngine.apiKey,
        modelName: aiEngine.model,
      });

    case "google":
      return new ChatGoogleGenerativeAI({
        apiKey: aiEngine.apiKey,
        model: aiEngine.model,
      });

    default: {
      const _exhaustiveCheck: never = aiEngine;
      throw new Error(
        `Unsupported AI engine: ${JSON.stringify(_exhaustiveCheck)}`,
      );
    }
  }
};
