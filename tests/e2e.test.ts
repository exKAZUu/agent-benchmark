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

  test("calc supports all four operators", async () => {
    const sub = await runCli(["calc", "10", "-", "4"]);
    expect(sub.stdout).toBe("6");
    const mul = await runCli(["calc", "3", "*", "4"]);
    expect(mul.stdout).toBe("12");
    const div = await runCli(["calc", "12", "/", "3"]);
    expect(div.stdout).toBe("4");
  });

  test("calc rejects invalid operator", async () => {
    const result = await runCli(["calc", "1", "%", "2"]);
    expect(result.exitCode).not.toBe(0);
  });

  test("unknown command fails", async () => {
    const result = await runCli(["bogus"]);
    expect(result.exitCode).not.toBe(0);
  });

  test("help mentions both commands", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc");
  });
});
