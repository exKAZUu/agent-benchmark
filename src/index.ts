import { Argument, InvalidArgumentError, program } from "commander";
import { calculate, currentText, type Operator } from "./cli";

function parseNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsed;
}

program.name("agent-benchmark");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .addArgument(new Argument("<left>", "Left operand").argParser(parseNumber))
  .addArgument(new Argument("<operator>", "Operator").choices(["+", "-", "*", "/"]))
  .addArgument(new Argument("<right>", "Right operand").argParser(parseNumber))
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
