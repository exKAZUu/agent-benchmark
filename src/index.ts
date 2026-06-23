import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const operators = ["+", "-", "*", "/"] as const satisfies readonly Operator[];

function parseNumber(value: string): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new InvalidArgumentError("must be a finite number");
  }

  return parsed;
}

function parseOperator(value: string): Operator {
  if (!operators.includes(value as Operator)) {
    throw new InvalidArgumentError(`must be one of ${operators.join(", ")}`);
  }

  return value as Operator;
}

const program = new Command();

program
  .name("agent-benchmark")
  .showHelpAfterError()
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "left number", parseNumber)
  .argument("<operator>", "operator", parseOperator)
  .argument("<right>", "right number", parseNumber)
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

program.parse();

if (process.argv.slice(2).length === 0) {
  program.help({ error: true });
}
