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

  test("calc prints only the number result", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test("missing command displays help and exits with non-zero code", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Usage: agent-benchmark [options] [command]");
    expect(result.stderr).toContain("Commands:");
  });

  test("unknown command exits with non-zero code and prints error", async () => {
    const result = await runCli(["foo"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error: unknown command 'foo'");
  });

  test("calc with non-numeric left argument prints error and exits with non-zero code", async () => {
    const result = await runCli(["calc", "abc", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe("Error: left must be a number");
  });

  test("calc with non-numeric right argument prints error and exits with non-zero code", async () => {
    const result = await runCli(["calc", "2", "+", "abc"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe("Error: right must be a number");
  });

  test("calc with invalid operator prints error and exits with non-zero code", async () => {
    const result = await runCli(["calc", "2", "%", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe("Error: operator must be one of +, -, *, /");
  });

  test("help option displays program usage", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage: agent-benchmark [options] [command]");
    expect(result.stdout).toContain("Commands:");
  });
});

