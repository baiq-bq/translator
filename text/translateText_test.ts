import { assertEquals, assertRejects } from "@std/assert";
import type { ChatOpenAI } from "@langchain/openai";
import translateText from "./translateText.ts";

class MockChat {
  calls: unknown[][] = [];
  constructor(private reply: unknown) {}
  invoke(messages: unknown[]) {
    this.calls.push(messages);
    return Promise.resolve({ content: this.reply } as { content: unknown });
  }
}

Deno.test("returns translated text", async () => {
  const chat = new MockChat("Bonjour");
  const result = await translateText(
    "Hello",
    "fr",
    chat as unknown as ChatOpenAI,
  );
  assertEquals(result, "Bonjour");
  assertEquals(chat.calls.length, 1);
});

Deno.test("throws if translation content missing", async () => {
  const chat = new MockChat(undefined);
  await assertRejects(() =>
    translateText("Hello", "fr", chat as unknown as ChatOpenAI)
  );
});

Deno.test("throws if translation content is not string", async () => {
  const chat = new MockChat(42 as unknown);
  await assertRejects(() =>
    translateText("Hello", "fr", chat as unknown as ChatOpenAI)
  );
});
