/**
 * Representation of any JSON-compatible object used for translation.
 */
export type JSONObject = {
  [key: string]:
    | string
    | number
    | boolean
    | Array<JSONObject | string | number | boolean>
    | JSONObject;
};

/**
 * Recursively translate the values of a JSON object.
 *
 * @param json The JSON object whose string fields should be translated.
 * @param targetLang ISO language code the values will be translated to.
 * @param translateTextFn Function used to translate individual strings.
 * @returns A new JSON object with all translatable fields translated.
 *
 * @example
 * ```ts
 * const translated = await translateJSON(
 *   { greeting: "Hello" },
 *   "fr",
 *   translateText,
 * );
 * // => { greeting: "Bonjour" }
 * ```
 */
const translateJSON = async (
  json: JSONObject,
  targetLang: string,
  translateTextFn: (text: string, targetLang: string) => Promise<string>,
): Promise<JSONObject> => {
  const result: JSONObject = {};

  for (const [key, value] of Object.entries(json)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[key] = await translateJSON(
        value as JSONObject,
        targetLang,
        translateTextFn,
      );
      continue;
    } else if (Array.isArray(value)) {
      result[key] = await Promise.all(
        value.map(async (item) => {
          if (typeof item === "string") {
            return await translateTextFn(item, targetLang);
          } else if (typeof item === "object" && item !== null) {
            return await translateJSON(
              item as JSONObject,
              targetLang,
              translateTextFn,
            );
          } else {
            return item;
          }
        }),
      );
    } else if (typeof value === "string") {
      result[key] = await translateTextFn(value, targetLang);
    } else if (typeof value === "number" || typeof value === "boolean") {
      result[key] = value;
    } else {
      result[key] = value;
    }
  }

  return result;
};

export default translateJSON;
