import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const operators = ["+", "-", "*", "/"] as const;

function parseNumber(value: string): number {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new InvalidArgumentError("must be a finite number");
  }

  return number;
}

function parseOperator(value: string): Operator {
  if (operators.includes(value as Operator)) {
    return value as Operator;
  }

  throw new InvalidArgumentError(`must be one of: ${operators.join(", ")}`);
}

const program = new Command()
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .showHelpAfterError()
  .showSuggestionAfterError();

program
  .command(
    "hello",
  )
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "left operand", parseNumber)
  .argument("<operator>", "operator", parseOperator)
  .argument("<right>", "right operand", parseNumber)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();

if (program.args.length === 0) {
  program.help({ error: true });
}
