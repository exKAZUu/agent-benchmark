import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const operators = ["+", "-", "*", "/"] as const;

function parseFiniteNumber(value: string): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new InvalidArgumentError("Expected a finite number.");
  }

  return parsed;
}

function parseOperator(value: string): Operator {
  if (operators.some((operator) => operator === value)) {
    return value as Operator;
  }

  throw new InvalidArgumentError(`Expected one of ${operators.join(", ")}.`);
}

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .showHelpAfterError()
  .showSuggestionAfterError();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "left number", parseFiniteNumber)
  .argument("<operator>", "operator: +, -, *, or /", parseOperator)
  .argument("<right>", "right number", parseFiniteNumber)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

if (process.argv.slice(2).length === 0) {
  program.help({ error: true });
}

program.parse();
