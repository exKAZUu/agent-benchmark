import { describe, expect, test } from "bun:test";
import { calculate } from "../src/cli";

describe("calculate", () => {
  test("adds", () => {
    expect(calculate(2, "+", 3)).toBe(5);
  });

  test("subtracts", () => {
    expect(calculate(10, "-", 4)).toBe(6);
  });

  test("multiplies", () => {
    expect(calculate(3, "*", 4)).toBe(12);
  });

  test("divides", () => {
    expect(calculate(12, "/", 3)).toBe(4);
  });

  test("modulo", () => {
    expect(calculate(10, "%", 3)).toBe(1);
    expect(calculate(10, "%", 5)).toBe(0); // Added unit tests for the modulo operator.
  });
});
