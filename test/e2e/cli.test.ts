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
  test("hello prints the current text", async () => {
    const result = await runCli(["hello"]);

    expect(result).toEqual({
      exitCode: 0,
      stderr: "",
      stdout: "Hello via Bun!",
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
      exitCode: 0,
      stderr: "",
      stdout: expected,
    });
  });

  test("rejects an unsupported operator", async () => {
    const result = await runCli(["calc", "2", "%", "3"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Allowed choices are +, -, *, /");
  });

  test("rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "two", "+", "3"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("must be a finite number");
  });

  test("shows help and fails when no command is supplied", async () => {
    const result = await runCli([]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Usage: agent-benchmark [options] [command]");
    expect(result.stderr).toContain("hello");
    expect(result.stderr).toContain("calc");
  });
});
