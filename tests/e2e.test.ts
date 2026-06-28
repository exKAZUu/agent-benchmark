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

  test("calc prints error and exits with 1 for invalid operands", async () => {
    const result1 = await runCli(["calc", "a", "+", "3"]);
    expect(result1.exitCode).toBe(1);
    expect(result1.stderr).toContain("error: left must be a number");

    const result2 = await runCli(["calc", "2", "+", "b"]);
    expect(result2.exitCode).toBe(1);
    expect(result2.stderr).toContain("error: right must be a number");
  });

  test("calc prints error and exits with 1 for invalid operators", async () => {
    const result = await runCli(["calc", "2", "foo", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: operator must be one of: +, -, *, /");
  });

  test("calc prints error and exits with 1 for missing arguments", async () => {
    const result = await runCli(["calc", "2", "+"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: missing required argument 'right'");
  });

  test("unknown command prints error and exits with 1", async () => {
    const result = await runCli(["unknown"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: unknown command 'unknown'");
  });

  test("no arguments prints help and exits with 1", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain("Usage:");
  });

  test("--help prints help and exits with 0", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage:");
  });
});

