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
    expect(result.stdout).toBe("Hello via Bun!");
  });

  test("calc prints only the number result for addition", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test("calc prints only the number result for subtraction", async () => {
    const result = await runCli(["calc", "10", "-", "4"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("6");
  });

  test("calc prints only the number result for multiplication", async () => {
    const result = await runCli(["calc", "3", "*", "4"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("12");
  });

  test("calc prints only the number result for division", async () => {
    const result = await runCli(["calc", "12", "/", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("4");
  });

  test("calc shows error on non-numeric left operand", async () => {
    const result = await runCli(["calc", "foo", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: argument 'left' must be a number");
    expect(result.stdout).toBe("");
  });

  test("calc shows error on non-numeric right operand", async () => {
    const result = await runCli(["calc", "2", "+", "bar"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: argument 'right' must be a number");
    expect(result.stdout).toBe("");
  });

  test("calc shows error on invalid operator", async () => {
    const result = await runCli(["calc", "2", "invalid", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: argument 'operator' must be one of");
    expect(result.stdout).toBe("");
  });

  test("shows help and exits on empty arguments", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Usage:");
  });

  test("shows error on unknown command", async () => {
    const result = await runCli(["unknownCommand"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: unknown command");
  });
});
