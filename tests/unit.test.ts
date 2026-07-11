import { describe, expect, test } from "bun:test";
import { calculate } from "../src/cli";

describe("calculate", () => {
  test("adds two numbers", () => {
    expect(calculate(2, "+", 3)).toBe(5);
  });

  test("subtracts two numbers", () => {
    expect(calculate(5, "-", 3)).toBe(2);
  });

  test("multiplies two numbers", () => {
    expect(calculate(4, "*", 3)).toBe(12);
  });

  test("divides two numbers", () => {
    expect(calculate(6, "/", 3)).toBe(2);
  });

  test("computes the modulo", () => {
    expect(calculate(13, "%", 5)).toBe(3);
  });
});
