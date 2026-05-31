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

  test.each([
    [["calc", "2", "+", "3"], "5"],
    [["calc", "10", "-", "4"], "6"],
    [["calc", "3", "*", "4"], "12"],
    [["calc", "12", "/", "3"], "4"],
  ])("calc %p prints only the number result", async (args, expected) => {
    const result = await runCli(args);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe(expected);
  });

  test("missing command exits with top-level help", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Usage: agent-benchmark [options] [command]");
    expect(result.stderr).toContain("hello");
    expect(result.stderr).toContain("calc <left> <operator> <right>");
  });

  test("invalid operator exits with command help", async () => {
    const result = await runCli(["calc", "2", "%", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain(
      "error: command-argument value '%' is invalid for argument 'operator'",
    );
    expect(result.stderr).toContain("Usage: agent-benchmark calc [options] <left> <operator> <right>");
  });

  test("invalid number exits with a user-facing parse error", async () => {
    const result = await runCli(["calc", "two", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain(
      "error: command-argument value 'two' is invalid for argument 'left'. must be a finite number",
    );
  });
});
