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

describe("commander cli detailed behavior", () => {
  test("hello command prints the current text", async () => {
    const result = await runCli(["hello"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("Hello via Bun!");
  });

  test("calc commands compute operations successfully", async () => {
    const additions = await runCli(["calc", "5", "+", "8"]);
    expect(additions.exitCode).toBe(0);
    expect(additions.stdout).toBe("13");

    const subtractions = await runCli(["calc", "15", "-", "4"]);
    expect(subtractions.exitCode).toBe(0);
    expect(subtractions.stdout).toBe("11");

    const multiplications = await runCli(["calc", "3", "*", "9"]);
    expect(multiplications.exitCode).toBe(0);
    expect(multiplications.stdout).toBe("27");

    const divisions = await runCli(["calc", "24", "/", "8"]);
    expect(divisions.exitCode).toBe(0);
    expect(divisions.stdout).toBe("3");

    const modulos = await runCli(["calc", "17", "%", "5"]);
    expect(modulos.exitCode).toBe(0);
    expect(modulos.stdout).toBe("2");
  });

  test("rejects an operator outside the allowed choices", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("operator");
    expect(result.stdout).toBe("");
  });

  test("rejects an unknown command", async () => {
    const result = await runCli(["unknownCommand"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("unknown command");
  });

  test("errors when no command is given", async () => {
    const result = await runCli([]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("Usage:");
  });
});
