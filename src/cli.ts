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
      if (right === 0) {
        throw new Error("Division by zero");
      }
      return left / right;
    case "%":
      if (right === 0) {
        throw new Error("Modulo by zero");
      }
      return left % right;
    default: {
      const exhaustiveCheck: never = operator;
      throw new Error(`Unhandled operator: ${exhaustiveCheck}`);
    }
  }
}
