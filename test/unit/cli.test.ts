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
  const process = Bun.spawn(["bun", "run", entry, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);

  return {
    stdout: stdout.trim(),
    stderr: stderr.trim(),
    exitCode,
  };
}

describe("agent-benchmark CLI", () => {
  test("prints the current greeting", async () => {
    await expect(runCli(["hello"])).resolves.toEqual({
      exitCode: 0,
      stderr: "",
      stdout: "Hello, World!",
    });
  });

  test("calculates with every supported operator", async () => {
    const cases = [
      { args: ["calc", "2", "+", "3"], expected: "5" },
      { args: ["calc", "10", "-", "4"], expected: "6" },
      { args: ["calc", "3", "*", "4"], expected: "12" },
      { args: ["calc", "7", "/", "2"], expected: "3.5" },
      { args: ["calc", "13", "%", "5"], expected: "3" },
    ];

    for (const { args, expected } of cases) {
      await expect(runCli(args)).resolves.toEqual({
        exitCode: 0,
        stderr: "",
        stdout: expected,
      });
    }
  });

  test("shows help when requested", async () => {
    const result = await runCli(["--help"]);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain(
      "Usage: agent-benchmark [options] [command]",
    );
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc <left> <operator> <right>");
  });

  test("requires a command", async () => {
    const result = await runCli([]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain(
      "Usage: agent-benchmark [options] [command]",
    );
    expect(result.stderr).toContain("hello");
    expect(result.stderr).toContain("calc <left> <operator> <right>");
  });

  test("rejects unknown commands", async () => {
    const result = await runCli(["unknown"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: unknown command 'unknown'");
    expect(result.stderr).toContain(
      "Usage: agent-benchmark [options] [command]",
    );
  });

  test("rejects unsupported operators", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain(
      "value '^' is invalid for argument 'operator'",
    );
    expect(result.stderr).toContain("Allowed choices are +, -, *, /, %");
    expect(result.stderr).toContain(
      "Usage: agent-benchmark calc [options] <left> <operator> <right>",
    );
  });

  test("rejects non-numeric operands", async () => {
    const result = await runCli(["calc", "abc", "+", "3"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain(
      "error: command-argument value 'abc' is invalid for argument 'left'",
    );
    expect(result.stderr).toContain("'abc' is not a number.");
  });

  test("requires all calculator arguments", async () => {
    const result = await runCli(["calc", "2", "+"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: missing required argument 'right'");
  });
});
