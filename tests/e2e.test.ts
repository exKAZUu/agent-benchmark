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
    expect(result.stdout).toBe("Hello, World!");
  });

  test.each([
    [["2", "+", "3"], "5"],
    [["10", "-", "4"], "6"],
    [["3", "*", "4"], "12"],
    [["12", "/", "3"], "4"],
    [["14", "%", "5"], "4"],
  ])("calc %p prints only the number result", async (args, expected) => {
    const result = await runCli(["calc", ...args]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe(expected);
  });

  test("help lists the available commands", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Usage: agent-benchmark [options] [command]");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc <left> <operator> <right>");
  });

  test("missing command exits with help", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(`${result.stdout}\n${result.stderr}`).toContain(
      "Usage: agent-benchmark [options] [command]",
    );
  });

  test("unknown command exits with an error", async () => {
    const result = await runCli(["goodbye"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: unknown command 'goodbye'");
  });

  test("unsupported operator exits with an error", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Allowed choices are +, -, *, /, %");
  });

  test("non-numeric operands exit with an error", async () => {
    const result = await runCli(["calc", "two", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: command-argument value 'two' is invalid");
    expect(result.stderr).toContain("must be a number");
  });
});
