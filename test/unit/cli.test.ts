import { describe, expect, test } from "bun:test";
import { join } from "node:path";

const entry = join(import.meta.dir, "..", "..", "src", "index.ts");

async function runCli(args: string[]) {
  const child = Bun.spawn([process.execPath, "run", entry, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);

  return {
    stdout: stdout.trim(),
    stderr: stderr.trim(),
    exitCode,
  };
}

describe("agent-benchmark CLI", () => {
  test("prints the current greeting", async () => {
    const result = await runCli(["hello"]);

    expect(result).toEqual({
      stdout: "Hello, World!",
      stderr: "",
      exitCode: 0,
    });
  });

  test.each([
    ["2", "+", "3", "5"],
    ["10", "-", "4", "6"],
    ["3", "*", "4", "12"],
    ["12", "/", "3", "4"],
    ["13", "%", "5", "3"],
    ["-7.5", "+", "2.5", "-5"],
  ])("calculates %s %s %s", async (left, operator, right, expected) => {
    const result = await runCli(["calc", left, operator, right]);

    expect(result).toEqual({
      stdout: expected,
      stderr: "",
      exitCode: 0,
    });
  });

  test.each([
    [["calc", "", "+", "3"], /left.*not a number/i],
    [["calc", "2", "+", "Infinity"], /right.*not a number/i],
    [["calc", "2", "power", "3"], /operator.*allowed choices/i],
    [["unknown"], /unknown command/i],
  ])("rejects invalid input: %j", async (args, expectedError) => {
    const result = await runCli(args as string[]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(expectedError as RegExp);
  });

  test("requires a command and shows usage", async () => {
    const result = await runCli([]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Usage:");
    expect(result.stderr).toContain("hello");
    expect(result.stderr).toContain("calc");
  });
});
