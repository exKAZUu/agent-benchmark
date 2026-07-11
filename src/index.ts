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
  if (value !== "+" && value !== "-" && value !== "*" && value !== "/") {
    throw new InvalidArgumentError('Allowed choices are "+", "-", "*", "/".');
  }
  return value;
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
  .command("calc <left> <operator> <right>")
  .description("Calculate a result from two numbers and an operator")
  .action((left: string, operator: string, right: string) => {
    console.log(calculate(parseNumber(left), parseOperator(operator), parseNumber(right)));
  });

program.parse();
