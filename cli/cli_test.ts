import { assertEquals } from "@std/assert";

async function run(args: string[], env: Record<string, string>) {
  const cmd = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-read", "--allow-write", ...args, "--testMode"],
    env,
    stdout: "piped",
    stderr: "piped",
  });
  const { code, stdout, stderr } = await cmd.output();
  console.log("Exit code:", code);
  if (code !== 0) {
    console.error("Error output:", new TextDecoder().decode(stderr));
    throw new Error(`Command failed with exit code ${code}`);
  }
  console.log("Standard output:", new TextDecoder().decode(stdout));
  if (stderr.length > 0) {
    console.warn("Standard error:", new TextDecoder().decode(stderr));
  }
  if (stdout.length === 0) {
    console.warn("No output received from command.");
  }
  if (stderr.length === 0) {
    console.warn("No error output received from command.");
  }
  return {
    code,
    stdout: new TextDecoder().decode(stdout),
    stderr: new TextDecoder().decode(stderr),
  };
}

Deno.test("translateText CLI", async () => {
  const { code, stdout } = await run(
    [
      "translateText.ts",
      "--engine=openai",
      "--model=gpt-4o",
      "--lang=fr",
      "--text=Hello",
      "--key=dummy",
    ],
    {} // no env needed
  );
  assertEquals(code, 0);
  assertEquals(stdout.trim(), "Hello-fr");
});

Deno.test("translateJSON CLI", async () => {
  const tmp = await Deno.makeTempFile({ suffix: ".json" });
  await Deno.writeTextFile(
    tmp,
    JSON.stringify({ greeting: "Hello", nested: { value: "World" } })
  );
  const { code, stdout } = await run(
    [
      "translateJSON.ts",
      "--engine=openai",
      "--model=gpt-4o",
      "--lang=fr",
      "--file=" + tmp,
      "--key=dummy",
    ],
    {}
  );

  assertEquals(code, 0);
  const out = JSON.parse(stdout);
  assertEquals(out, {
    greeting: "Hello-fr",
    nested: { value: "World-fr" },
  });
  await Deno.remove(tmp);
});

Deno.test("translateXML CLI", async () => {
  const tmp = await Deno.makeTempFile({ suffix: ".xml" });
  await Deno.writeTextFile(tmp, "<root><a>Hello</a><b>World</b></root>");
  const { code, stdout } = await run(
    [
      "translateXML.ts",
      "--engine=openai",
      "--model=gpt-4o",
      "--lang=fr",
      "--file=" + tmp,
      "--key=dummy",
    ],
    {}
  );
  assertEquals(code, 0);
  assertEquals(stdout.trim(), "<root><a>Hello-fr</a><b>World-fr</b></root>");
  await Deno.remove(tmp);
});
