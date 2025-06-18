/**
 * Convenience wrapper re-exporting {@link translateText} for users who want to
 * import from `jsr:@baiq/translator/text`.
 *
 * @module
 *
 * @see {@link translateText} for the main translation function.
 * @see {@link configureLangChain} for configuring LangChain with OpenAI or
 * Google Generative AI.
 * @see {@link LangChainConfig} for the configuration options.
 * @see {@link OpenAIModel} for the supported OpenAI models.
 * @see {@link GoogleModel} for the supported Google Generative AI models.
 */
export { default, default as translateText } from "./translateText.ts";
