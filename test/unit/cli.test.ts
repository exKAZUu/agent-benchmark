import { describe, expect, test } from "bun:test";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const entry = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src", "index.ts");

async function runCli(...args: string[]) {
  const process = Bun.spawn([Bun.which("bun") ?? "bun", "run", entry, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);

  return { stdout, stderr, exitCode };
}

describe("agent-benchmark CLI", () => {
  test("lists the available commands", async () => {
    const result = await runCli("--help");

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Usage: agent-benchmark [options] [command]");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc <left> <operator> <right>");
  });

  test("prints the greeting", async () => {
    const result = await runCli("hello");

    expect(result).toEqual({
      stdout: "Hello, World!\n",
      stderr: "",
      exitCode: 0,
    });
  });

  test.each([
    ["2", "+", "3", "5\n"],
    ["10", "-", "4", "6\n"],
    ["3", "*", "4", "12\n"],
    ["12", "/", "3", "4\n"],
    ["13", "%", "5", "3\n"],
  ])("calculates %s %s %s", async (left, operator, right, expected) => {
    const result = await runCli("calc", left, operator, right);

    expect(result).toEqual({ stdout: expected, stderr: "", exitCode: 0 });
  });

  test("rejects a non-numeric operand and explains calc usage", async () => {
    const result = await runCli("calc", "two", "+", "3");

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("'two' is not a number");
    expect(result.stderr).toContain("Usage: agent-benchmark calc [options] <left> <operator> <right>");
  });

  test("rejects operators outside the supported choices", async () => {
    const result = await runCli("calc", "2", "^", "3");

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Allowed choices are +, -, *, /, %");
  });

  test("rejects unknown commands and lists the available commands", async () => {
    const result = await runCli("unknown");

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: unknown command 'unknown'");
    expect(result.stderr).toContain("Commands:");
    expect(result.stderr).toContain("hello");
    expect(result.stderr).toContain("calc <left> <operator> <right>");
  });
});
