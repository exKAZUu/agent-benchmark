import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const operators: readonly Operator[] = ["+", "-", "*", "/", "%"];

function parseNumberArg(value: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsed;
}

function parseOperatorArg(value: string): Operator {
  if (!operators.includes(value as Operator)) {
    throw new InvalidArgumentError(`Allowed choices are ${operators.join(", ")}.`);
  }
  return value as Operator;
}

const program = new Command();

program.name("agent-benchmark");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "left operand", parseNumberArg)
  .argument("<operator>", "operator (+, -, *, /, %)", parseOperatorArg)
  .argument("<right>", "right operand", parseNumberArg)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
