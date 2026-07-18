import { Argument, Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const operators = ["+", "-", "*", "/"] as const satisfies readonly Operator[];

function parseNumber(value: string): number {
  const number = Number(value);
  if (Number.isNaN(number)) {
    throw new InvalidArgumentError("must be a number");
  }
  return number;
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
  .addArgument(new Argument("<left>").argParser(parseNumber))
  .addArgument(new Argument("<operator>").choices(operators))
  .addArgument(new Argument("<right>").argParser(parseNumber))
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
