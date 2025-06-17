/**
 * Entry point exporting all translation utilities.
 *
 * Re-exports {@link configureLangChain}, {@link translateJSON} and
 * {@link translateText} so consumers can import everything from the package
 * root. API keys can be supplied directly or via environment variables.
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
