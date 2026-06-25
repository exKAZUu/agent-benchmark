import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText } from "./cli";

const operators = ["+", "-", "*", "/"] as const;

function parseFiniteNumber(value: string): number {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new InvalidArgumentError("must be a finite number");
  }

  return number;
}

function parseOperator(value: string): (typeof operators)[number] {
  if (operators.includes(value as (typeof operators)[number])) {
    return value as (typeof operators)[number];
  }

  throw new InvalidArgumentError(`must be one of ${operators.join(", ")}`);
}

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .showHelpAfterError()
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "left number", parseFiniteNumber)
  .argument("<operator>", "operator", parseOperator)
  .argument("<right>", "right number", parseFiniteNumber)
  .action(
    (
      left: number,
      operator: (typeof operators)[number],
      right: number,
    ) => {
      console.log(calculate(left, operator, right));
    },
  );

program.parse();
