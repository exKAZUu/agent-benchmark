import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText } from "./cli";

const operators = ["+", "-", "*", "/"] as const;

function parseNumber(value: string): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new InvalidArgumentError("must be a finite number");
  }

  return parsed;
}

function parseOperator(value: string): (typeof operators)[number] {
  if (!operators.includes(value as (typeof operators)[number])) {
    throw new InvalidArgumentError(`must be one of ${operators.join(", ")}`);
  }

  return value as (typeof operators)[number];
}

const program = new Command()
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .showHelpAfterError()
  .showSuggestionAfterError();

program.command("hello").description("Print the current text").action(() => {
  console.log(currentText);
});

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "left operand", parseNumber)
  .argument("<operator>", "operator", parseOperator)
  .argument("<right>", "right operand", parseNumber)
  .action((left: number, operator: (typeof operators)[number], right: number) => {
    console.log(calculate(left, operator, right));
  });

if (process.argv.length <= 2) {
  program.help({ error: true });
}

program.parse();
