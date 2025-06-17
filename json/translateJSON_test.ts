import assert from "node:assert/strict";
import translateJson, { type JSONObject } from "./translateJSON.ts";

const stubTranslate = (text: string, lang: string) =>
  Promise.resolve(`${text}-${lang}`);

Deno.test("translates simple fields", async () => {
  const input: JSONObject = { greeting: "Hello" };
  const result = await translateJson(input, "fr", stubTranslate);
  assert.deepEqual(result, { greeting: "Hello-fr" });
});

Deno.test("handles nested structures", async () => {
  const input: JSONObject = {
    a: "Hi",
    nested: { b: ["World", 5, true] },
  };
  const result = await translateJson(input, "fr", stubTranslate);
  assert.deepEqual(result, {
    a: "Hi-fr",
    nested: { b: ["World-fr", 5, true] },
  });
});
