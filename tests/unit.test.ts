import { describe, expect, test } from "bun:test";
import { calculate, currentText } from "../src/cli";

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
});

describe("currentText", () => {
  test("is the expected greeting", () => {
    expect(currentText).toBe("Hello, World!");
  });
});
