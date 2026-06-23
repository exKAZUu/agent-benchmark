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
  test('hello prints "Hello, World!"', async () => {
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

  test("calc supports modulo", async () => {
    const result = await runCli(["calc", "17", "%", "5"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("2");
  });

  test("calc rejects unsupported operators", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain(
      "error: command-argument value '^' is invalid for argument 'operator'. must be one of: +, -, *, /, %",
    );
    expect(result.stderr).toContain(
      "Usage: agent-benchmark calc [options] <left> <operator> <right>",
    );
  });

  test("calc rejects non-numeric input", async () => {
    const result = await runCli(["calc", "nope", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain(
      "error: command-argument value 'nope' is invalid for argument 'left'. must be a finite number",
    );
  });

  test("unknown commands show the top-level help", async () => {
    const result = await runCli(["unknown"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: unknown command 'unknown'");
    expect(result.stderr).toContain("Usage: agent-benchmark [options] [command]");
    expect(result.stderr).toContain("hello");
    expect(result.stderr).toContain("calc <left> <operator> <right>");
  });
});
