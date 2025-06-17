/**
 * Entry point exporting all translation utilities.
 *
 * Re-exports {@link configureLangChain}, {@link translateJSON} and
 * {@link translateText} so consumers can import everything from the package
 * root. API keys can be supplied directly or via environment variables.
 *
 * @module
 * @see {@link translateText} for the main translation function.
 * @see {@link configureLangChain} for configuring LangChain with OpenAI or
 * Google Generative AI.
 * @see {@link LangChainConfig} for the configuration options.
 * @see {@link OpenAIModel} for the supported OpenAI models.
 * @see {@link GoogleModel} for the supported Google Generative AI models.
 */
import translateJSON from "./json/mod.ts";
import translateText from "./text/mod.ts";
import translateXML from "./xml/mod.ts";
import {
  configureLangChain,
  type GoogleModel,
  type LangChainConfig,
  type OpenAIModel,
} from "./LangChainConfig.ts";

export { configureLangChain, translateJSON, translateText, translateXML };
export type { GoogleModel, LangChainConfig, OpenAIModel };
