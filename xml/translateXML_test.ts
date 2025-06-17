import assert from "node:assert/strict";
import translateXML from "./translateXML.ts";

const stubTranslate = (text: string, lang: string) =>
  Promise.resolve(`${text}-${lang}`);

Deno.test("translates simple xml", async () => {
  const input = "<root><a>Hello</a><b>World</b></root>";
  const result = await translateXML(input, "fr", stubTranslate);
  assert.equal(result, "<root><a>Hello-fr</a><b>World-fr</b></root>");
});

Deno.test("stops recursion at tag", async () => {
  const input =
    "<page><paragraph><line>A example of paragraph</line><line>Another line</line></paragraph></page>";
  const result = await translateXML(input, "es", stubTranslate, "paragraph");
  assert.equal(
    result,
    `<page><paragraph><line>A example of paragraph</line><line>Another line</line>-es</paragraph></page>`,
  );
});
