import translateJSON from "./json/mod.ts";
import translateText from "./text/mod.ts";
import {
  configureLangChain,
  type LangChainConfig,
  type OpenAIModel,
  type GoogleModel,
} from "./LangChainConfig.ts";

/**
 * Entry point exporting all translation utilities.
 *
 * Use {@link configureLangChain} to create a chat client and then pass it to
 * {@link translateText} or combine it with {@link translateJSON} to translate
 * JSON structures.
 */
export { configureLangChain, translateJSON, translateText };
export type { LangChainConfig, OpenAIModel, GoogleModel };
