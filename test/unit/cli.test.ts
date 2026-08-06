import { describe, expect, test } from "bun:test";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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
  test("hello prints Hello, World!", async () => {
    const result = await runCli(["hello"]);
    expect(result.stdout).toBe("Hello, World!");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  test.each([
    ["2", "+", "3", "5"],
    ["10", "-", "4", "6"],
    ["3", "*", "4", "12"],
    ["12", "/", "3", "4"],
    ["13", "%", "5", "3"],
    ["-13", "%", "5", "-3"],
    ["7.5", "%", "2", "1.5"],
  ])(
    "calc prints only the result of %s %s %s",
    async (left, operator, right, expected) => {
      const result = await runCli(["calc", left, operator, right]);
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout).toBe(expected);
    },
  );

  test("calc rejects an unsupported operator", async () => {
    const result = await runCli(["calc", "7", "^", "2"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Allowed choices are +, -, *, /, %.");
  });

  test("calc rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "abc", "+", "1"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("'abc' is not a number.");
  });

  test("an unknown command fails with an error", async () => {
    const result = await runCli(["frobnicate"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toStartWith("error:");
    expect(result.stderr).toContain("frobnicate");
  });

  test("--help documents both subcommands", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Usage: agent-benchmark");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc <left> <operator> <right>");
  });
});
