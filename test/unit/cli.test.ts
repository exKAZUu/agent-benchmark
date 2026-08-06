import { describe, expect, test } from "bun:test";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const entry = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "src",
  "index.ts",
);

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
  test("help lists the available commands", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("A benchmark for coding agents");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc <left> <operator> <right>");
  });

  test("hello prints Hello, World!", async () => {
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

  test.each([
    ["13", "5", "3"],
    ["-13", "5", "-3"],
    ["7.5", "2", "1.5"],
  ])("calc computes %s %% %s as %s", async (left, right, expected) => {
    const result = await runCli(["calc", left, "%", right]);
    expect(result).toEqual({
      exitCode: 0,
      stderr: "",
      stdout: expected,
    });
  });

  test("calc rejects an unsupported operator and shows command help", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("value '^' is invalid");
    expect(result.stderr).toContain("Allowed choices are +, -, *, /, %");
    expect(result.stderr).toContain(
      "Usage: agent-benchmark calc [options] <left> <operator> <right>",
    );
  });

  test("calc rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "two", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("value 'two' is invalid");
    expect(result.stderr).toContain("'two' is not a number");
  });

  test("calc rejects a missing operand", async () => {
    const result = await runCli(["calc", "2", "+"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: missing required argument 'right'");
  });

  test("--help lists every command", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Usage: agent-benchmark [options] [command]");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc <left> <operator> <right>");
  });

  test("an unknown command fails", async () => {
    const result = await runCli(["bye"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: unknown command 'bye'");
  });
});
