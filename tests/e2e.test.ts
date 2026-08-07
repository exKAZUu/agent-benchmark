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
  test("prints package information in help and version output", async () => {
    const [help, version] = await Promise.all([
      runCli(["--help"]),
      runCli(["--version"]),
    ]);

    expect(help.exitCode).toBe(0);
    expect(help.stderr).toBe("");
    expect(help.stdout).toContain("A benchmark for coding agents");
    expect(version.exitCode).toBe(0);
    expect(version.stderr).toBe("");
    expect(version.stdout).toBe("1.0.0");
  });

  test("hello prints the current text", async () => {
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

  test("calc computes the modulo of two numbers", async () => {
    const result = await runCli(["calc", "13", "%", "5"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("3");
  });

  test("calc keeps the sign of the left operand for modulo", async () => {
    const result = await runCli(["calc", "-13", "%", "5"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("-3");
  });

  test("calc rejects an unsupported operator", async () => {
    const result = await runCli(["calc", "13", "^", "5"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("^");
  });

  test("prints help information with --help", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage: agent-benchmark");
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc");
  });

  test("calc rejects non-numeric operands", async () => {
    const result = await runCli(["calc", "abc", "+", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("'abc' is not a number");
  });

  test("calc accepts decimal operands", async () => {
    const result = await runCli(["calc", "2.5", "*", "4"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("10");
  });

  test("calc rejects a non-numeric right operand", async () => {
    const result = await runCli(["calc", "3", "+", "xyz"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("'xyz' is not a number");
  });

  test("calc rejects a non-finite operand", async () => {
    const result = await runCli(["calc", "Infinity", "+", "1"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("'Infinity' is not a number");
  });

  test("calc rejects a missing operand", async () => {
    const result = await runCli(["calc", "2", "+"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("right");
  });

  test("cli rejects an unknown command", async () => {
    const result = await runCli(["greet"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("greet");
  });

  test("calc help documents every allowed operator", async () => {
    const result = await runCli(["calc", "--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("Usage: agent-benchmark calc");
    for (const operator of ["+", "-", "*", "/", "%"]) {
      expect(result.stdout).toContain(`"${operator}"`);
    }
  });
});
