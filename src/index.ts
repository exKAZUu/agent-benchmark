import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

function parseNumber(value: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsed;
}

function parseOperator(value: string): Operator {
  if (value === "+" || value === "-" || value === "*" || value === "/") {
    return value;
  }
  throw new InvalidArgumentError("Allowed choices are +, -, *, /.");
}

const program = new Command();

program.name("agent-benchmark").description("A benchmark for coding agents");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "The left operand", parseNumber)
  .argument("<operator>", "The operator (+, -, *, /)", parseOperator)
  .argument("<right>", "The right operand", parseNumber)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
