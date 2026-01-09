export const currentText = "Hello via Bun!";

export const OPERATORS = ["+", "-", "*", "/", "%"] as const;

export type Operator = (typeof OPERATORS)[number];

export function calculate(left: number, operator: Operator, right: number): number {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "%":
      if (right === 0) {
        throw new Error("Division by zero");
      }
      return left % right;
  }
}
