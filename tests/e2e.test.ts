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
    ["-", "10", "4", "6"],
    ["*", "3", "4", "12"],
    ["/", "12", "3", "4"],
  ])("calc applies the %s operator", async (operator, left, right, expected) => {
    const result = await runCli(["calc", left, operator, right]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe(expected);
  });

  test("calc rejects an unknown operator", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("^");
  });

  test("calc rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "two", "+", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("two");
  });

  test("calc requires all three operands", async () => {
    const result = await runCli(["calc", "2", "+"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("right");
  });

  test("an unknown command fails", async () => {
    const result = await runCli(["nope"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("nope");
  });

  test("no command prints help and fails", async () => {
    const result = await runCli([]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("calc");
    expect(result.stderr).toContain("hello");
  });

  test("--help lists both commands", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc");
  });
});
