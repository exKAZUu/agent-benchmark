import { describe, expect, test } from "bun:test";
import { calculate } from "../../src/cli";

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

  test("returns the modulo remainder", () => {
    expect(calculate(14, "%", 5)).toBe(4);
  });
});
