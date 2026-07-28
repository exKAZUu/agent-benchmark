import { describe, expect, test } from "bun:test";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const entry = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "src",
  "index.ts",
);

async function runCli(args: string[]) {
  const process = Bun.spawn(["bun", "run", entry, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);

  return {
    stdout: stdout.trim(),
    stderr: stderr.trim(),
    exitCode,
  };
}

describe("agent-benchmark CLI", () => {
  test("lists the available commands in its help", async () => {
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

  test("rejects unknown commands", async () => {
    const result = await runCli(["unknown"]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("unknown command 'unknown'");
  });

  test("hello prints the current text", async () => {
    const result = await runCli(["hello"]);

    expect(result).toEqual({
      exitCode: 0,
      stderr: "",
      stdout: "Hello, World!",
    });
  });

  test.each([
    ["2", "+", "3", "5"],
    ["10", "-", "4", "6"],
    ["3", "*", "4", "12"],
    ["12", "/", "3", "4"],
    ["13", "%", "5", "3"],
    ["-13", "%", "5", "-3"],
    ["7.5", "%", "2", "1.5"],
  ])("calc evaluates %s %s %s", async (left, operator, right, expected) => {
    const result = await runCli(["calc", left, operator, right]);

    expect(result).toEqual({
      exitCode: 0,
      stderr: "",
      stdout: expected,
    });
  });

  test("calc rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "not-a-number", "+", "3"]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("'not-a-number' is not a number");
  });

  test("calc rejects unsupported operators", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Allowed choices are +, -, *, /, %");
  });

  test("calc rejects a missing operand", async () => {
    const result = await runCli(["calc", "2", "+"]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("missing required argument 'right'");
  });
});
