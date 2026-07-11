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

  test("calc adds numbers", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test("calc subtracts numbers", async () => {
    const result = await runCli(["calc", "10", "-", "4"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("6");
  });

  test("calc multiplies numbers", async () => {
    const result = await runCli(["calc", "3", "*", "4"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("12");
  });

  test("calc divides numbers", async () => {
    const result = await runCli(["calc", "12", "/", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("4");
  });

  test("calc rejects non-number left operand", async () => {
    const result = await runCli(["calc", "abc", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: argument 'left' must be a number");
  });

  test("calc rejects non-number right operand", async () => {
    const result = await runCli(["calc", "2", "+", "xyz"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: argument 'right' must be a number");
  });

  test("calc rejects invalid operator", async () => {
    const result = await runCli(["calc", "2", "%", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: argument 'operator' must be one of: +, -, *, /");
  });

  test("prints help and exits with non-zero code when no command is provided", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Usage: agent-benchmark");
  });

  test("exits with non-zero code for unknown command", async () => {
    const result = await runCli(["invalidcmd"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: unknown command");
  });

  test("prints help and exits with 0 on --help", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage: agent-benchmark");
  });
});
