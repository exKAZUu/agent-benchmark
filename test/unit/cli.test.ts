import { describe, expect, test } from "bun:test";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const entry = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "src",
  "index.ts",
);

async function runCli(args: string[]) {
  const proc = Bun.spawn([process.execPath, "run", entry, ...args], {
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

describe("CLI", () => {
  test.each([
    [["2", "+", "3"], "5"],
    [["10", "-", "4"], "6"],
    [["3", "*", "4"], "12"],
    [["12", "/", "3"], "4"],
    [["-13", "%", "5"], "-3"],
    [["7.5", "%", "2"], "1.5"],
  ])("calc %j prints %s", async (args, expected) => {
    const result = await runCli(["calc", ...args]);

    expect(result).toEqual({
      stdout: expected,
      stderr: "",
      exitCode: 0,
    });
  });

  test.each([
    [["calc", "two", "+", "3"], "'two' is not a number"],
    [["calc", "2", "+", "three"], "'three' is not a number"],
    [["calc", "2", "^", "3"], "Allowed choices are +, -, *, /, %"],
    [["calc", "2", "+"], "missing required argument 'right'"],
    [["unknown"], "unknown command 'unknown'"],
  ])("rejects invalid input %j", async (args, expectedError) => {
    const result = await runCli(args);

    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain(expectedError);
  });
});
