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

  test("calc prints only the number result", async () => {
    const result = await runCli(["calc", "2", "+", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("5");
  });

  test("calc supports modulo", async () => {
    const result = await runCli(["calc", "10", "%", "3"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("1");
  });

  test("calc accepts every supported operator", async () => {
    await expect(runCli(["calc", "10", "-", "4"])).resolves.toMatchObject({
      exitCode: 0,
      stdout: "6",
      stderr: "",
    });
    await expect(runCli(["calc", "3", "*", "4"])).resolves.toMatchObject({
      exitCode: 0,
      stdout: "12",
      stderr: "",
    });
    await expect(runCli(["calc", "12", "/", "3"])).resolves.toMatchObject({
      exitCode: 0,
      stdout: "4",
      stderr: "",
    });
  });

  test("missing command prints help and exits with an error", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Usage: agent-benchmark [options] [command]");
    expect(result.stderr).toContain("hello");
    expect(result.stderr).toContain("calc");
  });

  test("unknown commands print a user-facing error", async () => {
    const result = await runCli(["unknown"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: unknown command 'unknown'");
    expect(result.stderr).toContain("Usage: agent-benchmark [options] [command]");
  });

  test("invalid calculator input prints a user-facing error", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("error: command-argument value '^' is invalid for argument 'operator'");
    expect(result.stderr).toContain("must be one of +, -, *, /, %");
  });
});
