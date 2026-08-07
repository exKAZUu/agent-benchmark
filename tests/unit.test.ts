import { describe, expect, test } from "bun:test";
import { calculate, currentText } from "../src/cli";

describe("currentText", () => {
  test("is Hello, World!", () => {
    expect(currentText).toBe("Hello, World!");
  });
});

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

  test("computes the remainder", () => {
    expect(calculate(13, "%", 5)).toBe(3);
    expect(calculate(-13, "%", 5)).toBe(-3);
    expect(calculate(13, "%", -5)).toBe(3);
    expect(calculate(7.5, "%", 2)).toBe(1.5);
  });

  test("returns NaN for a remainder by zero", () => {
    expect(calculate(13, "%", 0)).toBeNaN();
  });
});
