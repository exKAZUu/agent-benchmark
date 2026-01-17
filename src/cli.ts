export const currentText = "Hello via Bun!";

export type Operator = "+" | "-" | "*" | "/" | "%";

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
      return left % right;
    default: {
      const _exhaustive: never = operator;
      throw new Error(`Unknown operator: ${_exhaustive}`);
    }
  }
}
