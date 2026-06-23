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
    expect(result.stdout).toBe("Hello via Bun!");
  });

  test("calc prints only the number result", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test("calc handles negative numbers and decimals", async () => {
    const result = await runCli(["calc", "-2.5", "*", "4"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("-10");
  });

  test("fails when no arguments are provided", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout + result.stderr).toContain("Usage: agent-benchmark");
  });

  test("fails on invalid command", async () => {
    const result = await runCli(["invalidcmd"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Error: Invalid command");
  });

  test("fails on invalid left operand", async () => {
    const result = await runCli(["calc", "foo", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Error: left operand must be a number");
  });

  test("fails on invalid operator", async () => {
    const result = await runCli(["calc", "2", "%", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Error: operator must be one of");
  });

  test("fails on invalid right operand", async () => {
    const result = await runCli(["calc", "2", "+", "bar"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Error: right operand must be a number");
  });

  test("fails on missing operand", async () => {
    const result = await runCli(["calc", "2", "+"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("missing required argument");
  });

  test("displays help info with --help option", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage: agent-benchmark");
  });
});
