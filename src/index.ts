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

function parseOperator(value: string) {
  if (!operators.includes(value as (typeof operators)[number])) {
    throw new InvalidArgumentError(`must be one of ${operators.join(", ")}`);
  }

  return value as (typeof operators)[number];
}

export function createProgram() {
  const program = new Command();

  program
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
    .argument("<left>", "left number", parseNumber)
    .argument("<operator>", "operator", parseOperator)
    .argument("<right>", "right number", parseNumber)
    .action((left, operator, right) => {
      console.log(calculate(left, operator, right));
    });

  return program;
}

if (import.meta.main) {
  const program = createProgram();

  if (process.argv.slice(2).length === 0) {
    program.help({ error: true });
  } else {
    program.parse();
  }
}
