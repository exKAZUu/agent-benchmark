import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const operators: Operator[] = ["+", "-", "*", "/"];

function parseNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new InvalidArgumentError(`'${value}' is not a number.`);
  }
  return parsed;
}

function parseOperator(value: string): Operator {
  if (!operators.includes(value as Operator)) {
    throw new InvalidArgumentError(`Allowed choices are ${operators.join(", ")}.`);
  }
  return value as Operator;
}

const program = new Command();

program.name("agent-benchmark").showHelpAfterError();

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
  .argument("<operator>", `operator (${operators.join(", ")})`, parseOperator)
  .argument("<right>", "right operand", parseNumber)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
