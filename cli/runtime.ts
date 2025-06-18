import process from "node:process";

export const isDeno = typeof Deno !== "undefined" && !!Deno?.version?.deno;

export function getArgs(): string[] {
  return isDeno ? Deno.args : process.argv.slice(2);
}

export function getEnv(key: string): string | undefined {
  return isDeno ? Deno.env.get(key) ?? undefined : process.env[key];
}

export async function readText(path: string): Promise<string> {
  if (isDeno) return await Deno.readTextFile(path);
  const fs = await import("node:fs/promises");
  return await fs.readFile(path, "utf8");
}

export function exit(code: number): never {
  if (isDeno) {
    Deno.exit(code);
  } else {
    process.exit(code);
  }
  throw new Error("unreachable");
}

export function parseCliArgs(args: string[]): Record<string, string | boolean> {
  const result: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith("--")) continue;
    const withoutPrefix = arg.slice(2);
    if (withoutPrefix.includes("=")) {
      const [key, val] = withoutPrefix.split("=");
      result[key] = val;
    } else {
      const next = args[i + 1];
      if (next && !next.startsWith("--")) {
        result[withoutPrefix] = next;
        i++;
      } else {
        result[withoutPrefix] = true;
      }
    }
  }
  return result;
}
