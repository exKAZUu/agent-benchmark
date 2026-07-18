import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

function parseNumber(value: string): number {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new InvalidArgumentError("must be a finite number");
  }
  return number;
}

function parseOperator(value: string): Operator {
  switch (value) {
    case "+":
    case "-":
    case "*":
    case "/":
      return value;
    default:
      throw new InvalidArgumentError("must be one of +, -, *, /");
  }
}

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .showHelpAfterError();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "left operand", parseNumber)
  .argument("<operator>", "one of +, -, *, /", parseOperator)
  .argument("<right>", "right operand", parseNumber)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
