import { describe, expect, test } from "bun:test";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const entry = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "index.ts");

async function runCli(args: string[]) {
  const proc = Bun.spawn(["bun", "run", entry, ...args], {
    stdin: "ignore",
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
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("Hello, World!");
  });

  test("calc prints only the number result for addition", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test("calc prints correct result for subtraction, multiplication, division", async () => {
    const subResult = await runCli(["calc", "10", "-", "4"]);
    expect(subResult.exitCode).toBe(0);
    expect(subResult.stdout).toBe("6");

    const mulResult = await runCli(["calc", "3", "*", "4"]);
    expect(mulResult.exitCode).toBe(0);
    expect(mulResult.stdout).toBe("12");

    const divResult = await runCli(["calc", "12", "/", "3"]);
    expect(divResult.exitCode).toBe(0);
    expect(divResult.stdout).toBe("4");
  });

  test("calc rejects unsupported operator", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Expected one of +, -, *, /.");
  });

  test("calc rejects non-numeric operand", async () => {
    const result = await runCli(["calc", "foo", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Expected a finite number.");
  });

  test("requires a command when executed without arguments", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Usage: agent-benchmark");
  });
});
