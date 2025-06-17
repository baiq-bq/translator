import translateJson from "./json/mod.ts";
import translateText from "./text/mod.ts";
import { configureLangChain, type LangChainConfig } from "./LangChainConfig.ts";

/**
 * Entry point exporting all translation utilities.
 *
 * Use {@link configureLangChain} to create a chat client and then pass it to
 * {@link translateText} or combine it with {@link translateJson} to translate
 * JSON structures.
 */
export { configureLangChain, translateJson, translateText };
export type { LangChainConfig };
