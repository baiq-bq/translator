import { assertEquals } from "@std/assert";
import translateXML from "./translateXML.ts";

const stubTranslate = (text: string, lang: string) =>
  Promise.resolve(`${text}-${lang}`);

Deno.test("translates simple xml", async () => {
  const input = "<root><a>Hello</a><b>World</b></root>";
  const result = await translateXML(input, "fr", stubTranslate);
  assertEquals(result, `<root><a>Hello-fr</a><b>World-fr</b></root>`);
});

Deno.test("stops recursion at tag", async () => {
  const input =
    "<page><paragraph><line>A example of paragraph</line><line>Another line</line></paragraph></page>";
  const result = await translateXML(input, "es", stubTranslate, ["paragraph"]);
  assertEquals(
    result,
    `<page><paragraph><line>A example of paragraph</line><line>Another line</line>-es</paragraph></page>`,
  );
});

Deno.test("handles multiple stop tags", async () => {
  const input =
    "<page><paragraph>Hello <i>World</i></paragraph><note>Other <b>Text</b></note></page>";
  const result = await translateXML(
    input,
    "de",
    stubTranslate,
    ["paragraph", "note"],
  );
  assertEquals(
    result,
    `<page><paragraph>Hello <i>World</i>-de</paragraph><note>Other <b>Text</b>-de</note></page>`,
  );
});

Deno.test("translates selected attributes", async () => {
  const input = '<img alt="Hello" src="x.png" />';
  const result = await translateXML(
    input,
    "fr",
    stubTranslate,
    undefined,
    ["alt"],
  );
  assertEquals(result, '<img alt="Hello-fr" src="x.png" />');
});
