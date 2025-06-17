import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export type LangChainConfig =
  | { name: "openai"; model: "gpt-3.5-turbo" | "gpt-4" }
  | { name: "google"; model: "gemini-1.5-pro" };

export const configureLangChain = (
  aiEngine: LangChainConfig
): ChatOpenAI | ChatGoogleGenerativeAI => {
  switch (aiEngine.name) {
    case "openai":
      if (!Deno.env.get("OPENAI_API_KEY")) {
        throw new Error("OPENAI_API_KEY environment variable is not set.");
      }

      return new ChatOpenAI({
        openAIApiKey: Deno.env.get("OPENAI_API_KEY")!,
        modelName: aiEngine.model,
      });

    case "google":
      if (!Deno.env.get("GOOGLE_API_KEY")) {
        throw new Error("GOOGLE_API_KEY environment variable is not set.");
      }
      return new ChatGoogleGenerativeAI({
        apiKey: Deno.env.get("GOOGLE_API_KEY")!,
        model: aiEngine.model,
      });

    default: {
      const _exhaustiveCheck: never = aiEngine;
      throw new Error(
        `Unsupported AI engine: ${JSON.stringify(_exhaustiveCheck)}`
      );
    }
  }
};
