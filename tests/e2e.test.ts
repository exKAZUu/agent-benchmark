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

  test("invalid command prints unknown command error and exits with 1", async () => {
    const result = await runCli(["invalid-command"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: unknown command 'invalid-command'");
  });

  test("calc with non-numeric left operand fails and exits with 1", async () => {
    const result = await runCli(["calc", "a", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: left operand must be a number");
  });

  test("calc with non-numeric right operand fails and exits with 1", async () => {
    const result = await runCli(["calc", "2", "+", "a"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: right operand must be a number");
  });

  test("calc with invalid operator fails and exits with 1", async () => {
    const result = await runCli(["calc", "2", "%", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: operator must be one of +, -, *, /");
  });

  test("calc with missing arguments fails and exits with 1", async () => {
    const result = await runCli(["calc", "2", "+"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: missing required argument 'right'");
  });

  test("running CLI without arguments prints help and exits with 1", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Usage: agent-benchmark");
  });
});
