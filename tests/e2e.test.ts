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

  test("calc prints only the number result", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test.each([
    ["10", "-", "4", "6"],
    ["3", "*", "4", "12"],
    ["12", "/", "3", "4"],
    ["-1.5", "+", "2", "0.5"],
  ])("calc %s %s %s prints %s", async (left, operator, right, expected) => {
    const result = await runCli(["calc", left, operator, right]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe(expected);
  });

  test("help lists both commands", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc");
  });

  test("rejects an unknown command", async () => {
    const result = await runCli(["nope"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("nope");
  });

  test("rejects an unsupported operator", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).not.toBe("");
  });

  test("rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "two", "+", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).not.toBe("");
  });

  test("rejects a missing operand", async () => {
    const result = await runCli(["calc", "2", "+"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).not.toBe("");
  });

  test("requires a command", async () => {
    const result = await runCli([]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
  });
});
