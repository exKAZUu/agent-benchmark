import { Argument, Command, InvalidArgumentError } from "commander";
import { calculate, currentText } from "./cli";

function parseFiniteNumber(value: string): number {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new InvalidArgumentError("must be a finite number");
  }

  return number;
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
  .addArgument(new Argument("<left>", "left operand").argParser(parseFiniteNumber))
  .addArgument(new Argument("<operator>", "operator").choices(["+", "-", "*", "/"]))
  .addArgument(new Argument("<right>", "right operand").argParser(parseFiniteNumber))
  .action((left: number, operator: "+" | "-" | "*" | "/", right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
