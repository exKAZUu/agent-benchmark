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
    expect(result.stdout).toBe("Hello, World!");
  });

  test("calc prints only the number result", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test("calc computes the modulo of two numbers", async () => {
    const result = await runCli(["calc", "13", "%", "5"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("3");
  });

  test("calc rejects non-numeric operands", async () => {
    const result = await runCli(["calc", "abc", "+", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("'abc' is not a number.");
  });

  test("calc rejects unsupported operators", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("operator");
  });

  test("calc requires all three arguments", async () => {
    const result = await runCli(["calc", "2", "+"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("missing required argument");
  });

  test("fails on unknown command", async () => {
    const result = await runCli(["unknown-command"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("unknown command");
  });

  test("shows help information with --help", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("agent-benchmark");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc");
  });

  test("shows calc command help", async () => {
    const result = await runCli(["calc", "--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("<left>");
    expect(result.stdout).toContain("<operator>");
    expect(result.stdout).toContain("<right>");
  });
});
