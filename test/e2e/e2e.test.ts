import { describe, expect, test } from "bun:test";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const entry = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src", "index.ts");

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
    expect(result.stdout).toBe("Hello, World!");
  });

  test("calc prints only the number result", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test("calc exits with error when left or right is not a number", async () => {
    const result = await runCli(["calc", "abc", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: left and right arguments must be numbers");
  });

  test("calc exits with error when operator is invalid", async () => {
    const result = await runCli(["calc", "2", "%", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: operator must be +, -, *, or /");
  });

  test("calc exits with error when arguments are missing", async () => {
    const result = await runCli(["calc", "2", "+"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: missing required argument");
  });

  test("exits with error and shows help when no arguments are provided", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    const output = result.stdout + "\n" + result.stderr;
    expect(output).toContain("Usage: agent-benchmark");
  });

  test("exits with error when unknown command is provided", async () => {
    const result = await runCli(["invalidcommand"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: unknown command");
  });
});

