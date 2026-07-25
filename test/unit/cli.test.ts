import { describe, expect, test } from "bun:test";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const entry = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src", "index.ts");

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
  test("hello prints Hello, World!", async () => {
    const result = await runCli(["hello"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("Hello, World!");
  });

  test("calc prints only the number result", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test("calc supports modulo", async () => {
    const result = await runCli(["calc", "14", "%", "5"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("4");
  });

  test("calc keeps the fractional part of a division", async () => {
    const result = await runCli(["calc", "7", "/", "2"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("3.5");
  });

  test("calc rejects an unsupported operator", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("'^'");
    expect(result.stderr).toContain("'operator'");
  });

  test("calc rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "abc", "+", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("'left'");
    expect(result.stderr).toContain("Not a number.");
  });

  test("calc rejects a missing operand", async () => {
    const result = await runCli(["calc", "2", "+"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("missing required argument 'right'");
  });

  test("rejects an unknown command", async () => {
    const result = await runCli(["bogus"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("unknown command 'bogus'");
  });

  test("requires a command", async () => {
    const result = await runCli([]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    // Commander wraps long help lines, so compare against unwrapped text.
    const usage = result.stderr.replace(/\s+/g, " ");
    expect(usage).toContain("Usage:");
    expect(usage).toContain("calc <left> <operator> <right>");
  });

  test("--help documents both commands", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    const help = result.stdout.replace(/\s+/g, " ");
    expect(help).toContain("hello Print the current text");
    expect(help).toContain("calc <left> <operator> <right> Calculate a result from two numbers and an operator");
  });
});
