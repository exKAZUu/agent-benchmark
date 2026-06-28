import { Argument, Command, InvalidArgumentError } from "commander";
import { calculate, currentText } from "./cli";

const operators = ["+", "-", "*", "/"] as const;
type Operator = (typeof operators)[number];

function parseNumber(value: string): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new InvalidArgumentError("must be a finite number");
  }

  return parsed;
}

const program = new Command()
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .showHelpAfterError();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "left number", parseNumber)
  .addArgument(new Argument("<operator>", "operator").choices(operators))
  .argument("<right>", "right number", parseNumber)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

if (process.argv.length <= 2) {
  program.help({ error: true });
}

program.parse();
