import { describe, expect, test } from "bun:test";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const entry = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src", "index.ts");

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

  test("calc supports all documented operators", async () => {
    await expect(runCli(["calc", "10", "-", "4"])).resolves.toMatchObject({
      exitCode: 0,
      stderr: "",
      stdout: "6",
    });
    await expect(runCli(["calc", "3", "*", "4"])).resolves.toMatchObject({
      exitCode: 0,
      stderr: "",
      stdout: "12",
    });
    await expect(runCli(["calc", "12", "/", "3"])).resolves.toMatchObject({
      exitCode: 0,
      stderr: "",
      stdout: "4",
    });
  });

  test("requires a command", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Usage:");
    expect(result.stderr).toContain("hello");
    expect(result.stderr).toContain("calc");
  });

  test("rejects unsupported operators", async () => {
    const result = await runCli(["calc", "2", "%", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error:");
    expect(result.stderr).toContain("must be one of +, -, *, /");
    expect(result.stdout).toBe("");
  });

  test("rejects non-numeric operands", async () => {
    const result = await runCli(["calc", "left", "+", "3"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("error:");
    expect(result.stderr).toContain("must be a finite number");
    expect(result.stdout).toBe("");
  });
});
