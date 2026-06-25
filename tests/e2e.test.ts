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

  test.each([
    [["2", "+", "3"], "5"],
    [["10", "-", "4"], "6"],
    [["3", "*", "4"], "12"],
    [["12", "/", "3"], "4"],
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
    expect(result.stdout).toContain("Usage:");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc");
  });

  test("running without a command fails and shows help", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Usage:");
    expect(result.stderr).toContain("Commands:");
  });

  test("unknown commands fail with a user-facing error", async () => {
    const result = await runCli(["missing"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: unknown command 'missing'");
  });

  test("invalid calc operands fail with a user-facing error", async () => {
    const result = await runCli(["calc", "not-a-number", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: command-argument value 'not-a-number' is invalid for argument 'left'");
    expect(result.stderr).toContain("must be a finite number");
  });

  test("invalid calc operators fail with a user-facing error", async () => {
    const result = await runCli(["calc", "2", "%", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: command-argument value '%' is invalid for argument 'operator'");
    expect(result.stderr).toContain("must be one of +, -, *, /");
  });
});
