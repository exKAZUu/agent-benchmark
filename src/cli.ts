export const currentText = "Hello, World!";

export type Operator = "+" | "-" | "*" | "/";

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
    default:
      return assertUnreachable(operator);
  }
}

function assertUnreachable(value: never): never {
  throw new Error(`Unsupported operator: ${value}`);
}
