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

async function runCli(args: readonly string[]) {
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
  test("prints the greeting", async () => {
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
  ])("calculates %s %s %s", async (left, operator, right, expected) => {
    const result = await runCli(["calc", left, operator, right]);

    expect(result).toEqual({
      stdout: expected,
      stderr: "",
      exitCode: 0,
    });
  });

  test("shows help", async () => {
    const result = await runCli(["--help"]);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Usage: agent-benchmark [options] [command]");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc");
  });

  test.each([
    {
      name: "no command",
      args: [],
      message: "Usage: agent-benchmark [options] [command]",
    },
    {
      name: "an unknown command",
      args: ["unknown"],
      message: "error: unknown command 'unknown'",
    },
    {
      name: "a missing operand",
      args: ["calc", "2", "+"],
      message: "error: missing required argument 'right'",
    },
    {
      name: "an invalid number",
      args: ["calc", "two", "+", "3"],
      message: "error: command-argument value 'two' is invalid",
    },
    {
      name: "an unsupported operator",
      args: ["calc", "2", "%", "3"],
      message: "error: command-argument value '%' is invalid",
    },
  ])("rejects $name", async ({ args, message }) => {
    const result = await runCli(args);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain(message);
  });
});
