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

  test("calc prints modulo result", async () => {
    const result = await runCli(["calc", "13", "%", "5"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("3");
  });

  test("fails when invalid command is provided", async () => {
    const result = await runCli(["invalid-command"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("Invalid command");
  });

  test("fails when no arguments are provided", async () => {
    const result = await runCli([]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("Usage:");
  });

  test("fails when left operand is not a number", async () => {
    const result = await runCli(["calc", "abc", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Error: "abc" is not a number.');
  });

  test("fails when right operand is not a number", async () => {
    const result = await runCli(["calc", "2", "+", "xyz"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Error: "xyz" is not a number.');
  });

  test("fails when operator is invalid", async () => {
    const result = await runCli(["calc", "2", "foo", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Error: Invalid operator "foo".');
  });
});

