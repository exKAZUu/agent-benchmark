import { describe, expect, test } from "bun:test";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const entry = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "index.ts");

async function runCli(args: string[]) {
  const proc = Bun.spawn(["bun", "run", entry, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  return {
    stdout: stdout.trim(),
    stderr: stderr.trim(),
    exitCode,
  };
}

describe("cli", () => {
  test("hello prints the current text", async () => {
    const result = await runCli(["hello"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("Hello via Bun!");
  });

  test("calc prints only the number result", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test("no arguments prints help and exits with 1", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Usage:");
    expect(result.stderr).toContain("Commands:");
  });

  test("unknown command prints error and exits with 1", async () => {
    const result = await runCli(["unknown"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: unknown command");
  });

  test("calc with missing arguments exits with 1", async () => {
    const result = await runCli(["calc", "2", "+"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: missing required argument");
  });

  test("calc with invalid operand exits with 1", async () => {
    const result = await runCli(["calc", "foo", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("must be a number");
  });

  test("calc with invalid operator exits with 1", async () => {
    const result = await runCli(["calc", "2", "foo", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Allowed choices are");
  });
});
