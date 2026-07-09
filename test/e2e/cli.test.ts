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

  test("calc rejects an unsupported operator", async () => {
    const result = await runCli(["calc", "2", "%", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: command-argument value '%'");
    expect(result.stderr).toContain("Expected one of +, -, *, /.");
  });

  test("calc rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "two", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: command-argument value 'two'");
    expect(result.stderr).toContain("Expected a finite number.");
  });

  test("requires a command", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Usage: agent-benchmark");
    expect(result.stderr).toContain("hello");
    expect(result.stderr).toContain("calc");
  });
});
