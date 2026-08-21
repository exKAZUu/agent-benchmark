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
    expect(result.stdout).toBe("Hello, World!");
  });

  test("calc prints only the number result", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test("calc computes the modulo of two numbers", async () => {
    const result = await runCli(["calc", "13", "%", "5"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("3");
  });

  test("calc accepts negative operands instead of treating them as options", async () => {
    const result = await runCli(["calc", "-5", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("-2");
  });

  test("calc rejects an unsupported operator", async () => {
    const result = await runCli(["calc", "1", "^", "2"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("operator");
    for (const operator of ["+", "-", "*", "/", "%"]) {
      expect(result.stderr).toContain(operator);
    }
  });

  test("calc rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "abc", "+", "2"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("abc");
  });

  test("calc rejects a missing operand", async () => {
    const result = await runCli(["calc", "1", "+"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("right");
  });

  test("rejects an unknown command", async () => {
    const result = await runCli(["bogus"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("bogus");
  });

  test("--help lists the available commands", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc <left> <operator> <right>");
  });
});
