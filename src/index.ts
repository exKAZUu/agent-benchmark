import { Command, InvalidArgumentError } from "commander";
import { type Operator, calculate, currentText } from "./cli";

function parseNumber(value: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsed;
}

const operators = ["+", "-", "*", "/"] as const;

function parseOperator(value: string): Operator {
  if (!(operators as readonly string[]).includes(value)) {
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
  .argument("<left>", "The left operand", parseNumber)
  .argument("<operator>", "The operator (+, -, *, /)", parseOperator)
  .argument("<right>", "The right operand", parseNumber)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

// Require a subcommand rather than silently doing nothing.
if (process.argv.slice(2).length === 0) {
  program.help({ error: true });
}

program.parse();
