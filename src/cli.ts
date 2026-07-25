export const currentText = "Hello, World!";

export const operators = ["+", "-", "*", "/"] as const;

export type Operator = (typeof operators)[number];

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
  }
}
