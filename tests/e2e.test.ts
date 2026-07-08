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

  test("calc prints only the number result for modulo", async () => {
    const result = await runCli(["calc", "10", "%", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("1");
  });

  test("no arguments prints help and exits with non-zero", async () => {
    const result = await runCli([]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toContain("Usage:");
  });

  test("help option prints help and exits with zero", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage:");
  });

  test("invalid command prints error and exits with non-zero", async () => {
    const result = await runCli(["invalid-cmd"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("error: unknown command");
  });

  test("calc with missing arguments prints error and exits with non-zero", async () => {
    const result = await runCli(["calc", "2"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("error: missing required argument");
  });

  test("calc with non-numeric left operand prints error and exits with non-zero", async () => {
    const result = await runCli(["calc", "abc", "+", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("error: argument 'left' must be a number");
  });

  test("calc with non-numeric right operand prints error and exits with non-zero", async () => {
    const result = await runCli(["calc", "2", "+", "abc"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("error: argument 'right' must be a number");
  });

  test("calc with invalid operator prints error and exits with non-zero", async () => {
    const result = await runCli(["calc", "2", "invalid_operator", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("error: argument 'operator' must be one of");
  });
});
