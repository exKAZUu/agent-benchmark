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

  test("modulo remainder", () => {
    expect(calculate(10, "%", 3)).toBe(1);
  });

  test("modulo floats and negatives", () => {
    expect(calculate(5.5, "%", 2)).toBe(1.5);
    expect(calculate(-5, "%", 2)).toBe(-1);
  });

  test("modulo by zero returns NaN", () => {
    expect(Number.isNaN(calculate(1, "%", 0))).toBe(true);
  });
});
