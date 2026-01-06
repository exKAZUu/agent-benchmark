export const currentText = "Hello via Bun!";
export const operatorChoices = ["+", "-", "*", "/", "%"] as const;
export type Operator = (typeof operatorChoices)[number];

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
  }
}
