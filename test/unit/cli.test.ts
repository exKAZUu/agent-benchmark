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

describe("CLI", () => {
  test("hello prints the current text", async () => {
    const result = await runCli(["hello"]);

    expect(result).toEqual({
      stdout: "Hello, World!",
      stderr: "",
      exitCode: 0,
    });
  });

  test.each([
    ["2", "+", "3", "5"],
    ["10", "-", "4", "6"],
    ["3", "*", "4", "12"],
    ["12", "/", "3", "4"],
    ["13", "%", "5", "3"],
  ])("calc evaluates %s %s %s", async (left, operator, right, expected) => {
    const result = await runCli(["calc", left, operator, right]);

    expect(result).toEqual({
      stdout: expected,
      stderr: "",
      exitCode: 0,
    });
  });

  test("--help describes the available commands", async () => {
    const result = await runCli(["--help"]);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Usage: agent-benchmark");
    expect(result.stdout).toContain("-V, --version");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc <left> <operator> <right>");
  });

  test("--version prints the package version", async () => {
    const result = await runCli(["--version"]);

    expect(result).toEqual({
      stdout: "1.0.0",
      stderr: "",
      exitCode: 0,
    });
  });

  test("calc rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "two", "+", "3"]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("'two' is not a number");
  });

  test("calc rejects an unsupported operator", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Allowed choices are +, -, *, /, %");
  });
});
