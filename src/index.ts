import { Argument, Command, InvalidArgumentError } from "commander";
import { calculate, currentText } from "./cli";

const operators = ["+", "-", "*", "/"] as const;

function parseNumber(value: string): number {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new InvalidArgumentError("must be a finite number");
  }

  return number;
}

const program = new Command()
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .showHelpAfterError()
  .action(() => program.help({ error: true }));

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
  .addArgument(new Argument("<operator>", "operator").choices(operators))
  .argument("<right>", "right operand", parseNumber)
  .action((left: number, operator: (typeof operators)[number], right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
