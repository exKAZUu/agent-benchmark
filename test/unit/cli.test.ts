import { describe, expect, test } from "bun:test";
import { join } from "path";

const entry = join(import.meta.dir, "..", "..", "src", "index.ts");

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

describe("agent-benchmark CLI", () => {
  test("lists the available commands in its help", async () => {
    const result = await runCli(["--help"]);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Usage: agent-benchmark");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc <left> <operator> <right>");
  });

  test("hello prints the current text", async () => {
    const result = await runCli(["hello"]);

    expect(result).toEqual({
      stdout: "Hello, World!",
      stderr: "",
      exitCode: 0,
    });
  });

  test.each([
    ["adds", ["2", "+", "3"], "5"],
    ["subtracts", ["10", "-", "4"], "6"],
    ["multiplies", ["3", "*", "4"], "12"],
    ["divides", ["12", "/", "3"], "4"],
    ["computes the remainder", ["13", "%", "5"], "3"],
    ["computes a negative remainder", ["-13", "%", "5"], "-3"],
    ["computes a decimal remainder", ["7.5", "%", "2"], "1.5"],
  ])("calc %s", async (_description, args, expected) => {
    const result = await runCli(["calc", ...args]);

    expect(result).toEqual({
      stdout: expected,
      stderr: "",
      exitCode: 0,
    });
  });

  test("rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "two", "+", "3"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("'two' is not a number");
  });

  test("rejects an unsupported operator", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Allowed choices are +, -, *, /, %");
  });
});
