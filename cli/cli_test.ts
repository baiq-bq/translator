import assert from "node:assert/strict";

async function run(args: string[], env: Record<string, string>) {
  const cmd = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-env", ...args],
    env,
    stdout: "piped",
    stderr: "piped",
  });
  const { code, stdout, stderr } = await cmd.output();
  return {
    code,
    stdout: new TextDecoder().decode(stdout),
    stderr: new TextDecoder().decode(stderr),
  };
}

Deno.test("translateText CLI", async () => {
  const { code, stdout } = await run(
    [
      "cli/translateText.ts",
      "--engine",
      "openai",
      "--model",
      "gpt-4o",
      "--lang",
      "fr",
      "--text",
      "Hello",
      "--key",
      "dummy",
    ],
    { CLI_TEST_MODE: "1" }
  );
  assert.equal(code, 0);
  assert.equal(stdout.trim(), "Hello-fr");
});

Deno.test("translateJSON CLI", async () => {
  const tmp = await Deno.makeTempFile({ suffix: ".json" });
  await Deno.writeTextFile(tmp, JSON.stringify({ greeting: "Hello" }));
  const { code, stdout } = await run(
    [
      "--allow-read",
      "cli/translateJSON.ts",
      "--engine",
      "openai",
      "--model",
      "gpt-4o",
      "--lang",
      "fr",
      "--file",
      tmp,
      "--key",
      "dummy",
    ],
    { CLI_TEST_MODE: "1" }
  );
  assert.equal(code, 0);
  const out = JSON.parse(stdout);
  assert.deepEqual(out, { greeting: "Hello-fr" });
});
