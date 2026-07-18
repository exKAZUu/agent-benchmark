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

describe("cli e2e", () => {
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

  test("calc handles subtraction", async () => {
    const result = await runCli(["calc", "10", "-", "4"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("6");
  });

  test("calc handles multiplication", async () => {
    const result = await runCli(["calc", "3", "*", "4"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("12");
  });

  test("calc handles division", async () => {
    const result = await runCli(["calc", "12", "/", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("4");
  });

  test("calc shows error for invalid operator", async () => {
    const result = await runCli(["calc", "2", "%", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("operator");
  });

  test("calc shows error for invalid left operand", async () => {
    const result = await runCli(["calc", "abc", "+", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("left must be a number");
  });

  test("calc shows error for invalid right operand", async () => {
    const result = await runCli(["calc", "2", "+", "xyz"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("right must be a number");
  });

  test("shows help on help option", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage:");
  });
});
