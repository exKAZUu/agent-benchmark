import { Argument, Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

function parseNumber(value: string): number {
  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new InvalidArgumentError("must be a number");
  }

  return parsed;
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
  .addArgument(new Argument("<left>", "left number").argParser(parseNumber))
  .addArgument(
    new Argument("<operator>", "operator").choices(["+", "-", "*", "/", "%"]),
  )
  .addArgument(new Argument("<right>", "right number").argParser(parseNumber))
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

if (process.argv.length <= 2) {
  program.help({ error: true });
}

program.parse();
