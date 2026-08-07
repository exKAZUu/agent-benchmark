import { describe, expect, test } from "bun:test";
import { runCli } from "../helpers/run-cli";

describe("agent-benchmark CLI", () => {
  test("shows the available commands in help", async () => {
    const result = await runCli(["--help"]);

    expect(result).toEqual({
      stdout: expect.stringContaining("Usage: agent-benchmark [options] [command]"),
      stderr: "",
      exitCode: 0,
    });
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("calc <left> <operator> <right>");
  });

  test("hello prints the current text", async () => {
    expect(await runCli(["hello"])).toEqual({
      stdout: "Hello, World!",
      stderr: "",
      exitCode: 0,
    });
  });

  test.each([
    ["2", "+", "3", "5"],
    ["10", "-", "4", "6"],
    ["3", "*", "4", "12"],
    ["12", "/", "3", "4"],
    ["-13", "%", "5", "-3"],
  ])("calc evaluates %s %s %s", async (left, operator, right, expected) => {
    expect(await runCli(["calc", left, operator, right])).toEqual({
      stdout: expected,
      stderr: "",
      exitCode: 0,
    });
  });

  test("calc rejects a non-numeric operand", async () => {
    const result = await runCli(["calc", "two", "+", "3"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("'two' is not a number");
    expect(result.stderr).toContain("Usage: agent-benchmark calc");
  });

  test("calc rejects an unsupported operator", async () => {
    const result = await runCli(["calc", "2", "^", "3"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Allowed choices are +, -, *, /, %");
    expect(result.stderr).toContain("Usage: agent-benchmark calc");
  });

  test("rejects unknown commands", async () => {
    const result = await runCli(["unknown"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("unknown command 'unknown'");
    expect(result.stderr).toContain("Usage: agent-benchmark");
  });
});
