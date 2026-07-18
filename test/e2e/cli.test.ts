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
  test("shows help and fails when no command is provided", async () => {
    const result = await runCli([]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Usage: agent-benchmark [options] [command]");
    expect(result.stderr).toContain("hello");
    expect(result.stderr).toContain("calc <left> <operator> <right>");
  });

  test("hello prints the current text", async () => {
    const result = await runCli(["hello"]);

    expect(result).toEqual({
      stdout: "Hello via Bun!",
      stderr: "",
      exitCode: 0,
    });
  });

  test.each([
    ["2", "+", "3", "5"],
    ["10", "-", "4", "6"],
    ["3", "*", "4", "12"],
    ["12", "/", "3", "4"],
  ])("calc %s %s %s prints %s", async (left, operator, right, expected) => {
    const result = await runCli(["calc", left, operator, right]);

    expect(result).toEqual({
      stdout: expected,
      stderr: "",
      exitCode: 0,
    });
  });

  test("calc rejects unsupported operators", async () => {
    const result = await runCli(["calc", "5", "%", "2"]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("value '%' is invalid for argument 'operator'");
    expect(result.stderr).toContain("Allowed choices are +, -, *, /");
  });

  test("calc rejects values that are not numbers", async () => {
    const result = await runCli(["calc", "two", "+", "3"]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: command-argument value 'two' is invalid");
    expect(result.stderr).toContain("must be a number");
  });
});
