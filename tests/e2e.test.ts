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
    expect(result.stdout).toContain("Usage: agent-benchmark");
  });

  test("help option prints help and exits with 0", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage: agent-benchmark");
  });

  test("unknown command prints error and exits with 1", async () => {
    const result = await runCli(["invalid-command"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: unknown command");
  });

  test("calc with invalid left operand prints error and exits with 1", async () => {
    const result = await runCli(["calc", "abc", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Error: Invalid number for 'left'");
  });

  test("calc with invalid right operand prints error and exits with 1", async () => {
    const result = await runCli(["calc", "2", "+", "xyz"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Error: Invalid number for 'right'");
  });

  test("calc with invalid operator prints error and exits with 1", async () => {
    const result = await runCli(["calc", "2", "invalid_operator", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Error: Invalid operator");
  });
});

