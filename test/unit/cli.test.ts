import { describe, expect, test } from "bun:test";
import { fileURLToPath } from "url";

const entry = fileURLToPath(new URL("../../src/index.ts", import.meta.url));

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
  test("prints help", async () => {
    const result = await runCli(["--help"]);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Usage: agent-benchmark");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc <left> <operator> <right>");
  });

  test("requires a command", async () => {
    const result = await runCli([]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Usage: agent-benchmark");
  });

  test("hello prints the current text", async () => {
    const result = await runCli(["hello"]);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("Hello, World!");
  });

  test.each([
    ["+", "5"],
    ["-", "-1"],
    ["*", "6"],
    ["/", "0.6666666666666666"],
    ["%", "2"],
  ])("calc supports the %s operator", async (operator, expected) => {
    const result = await runCli(["calc", "2", operator, "3"]);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe(expected);
  });

  test("calc rejects an unknown operator", async () => {
    const result = await runCli(["calc", "1", "x", "2"]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Allowed choices are +, -, *, /, %");
  });

  test("calc rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "abc", "+", "2"]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Not a number");
  });
});
