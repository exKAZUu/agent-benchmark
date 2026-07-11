import { Argument, Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

function parseNumber(value: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsed;
}

const program = new Command();

program.name("agent-benchmark").showHelpAfterError();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .addArgument(new Argument("<left>", "The left operand").argParser(parseNumber))
  .addArgument(new Argument("<operator>", "The operator").choices(["+", "-", "*", "/"]))
  .addArgument(new Argument("<right>", "The right operand").argParser(parseNumber))
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

if (process.argv.slice(2).length === 0) {
  program.help({ error: true });
}

program.parse(process.argv);
