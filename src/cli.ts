export const currentText = "Hello via Bun!";

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
  }
}

export function hello() {
    console.log(currentText);
}

export function calc(left: string, operator: Operator, right: string) {
    const l = Number(left);
    const r = Number(right);
    const result = calculate(l, operator, r);
    console.log(result);
}
