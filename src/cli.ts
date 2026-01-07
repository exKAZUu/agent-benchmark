export const currentText = "Hello via Bun!";

export type Operator = "+" | "-" | "*" | "/" | "%";

export function calculate(left: number, operator: Operator, right: number): number {
  if ((operator === "/" || operator === "%") && right === 0) {
    throw new Error("Division by zero is not allowed.");
  }

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
      const exhaustiveCheck: never = operator;
      throw new Error(`Unsupported operator: ${exhaustiveCheck}`);
    }
  }
}
