import { Argument, InvalidArgumentError, program } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const operators: Operator[] = ["+", "-", "*", "/"];

function parseOperand(value: string): number {
  const parsed = Number(value);
  if (value.trim() === "" || Number.isNaN(parsed)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsed;
}

program.name("agent-benchmark").description("A benchmark for coding agents");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .addArgument(new Argument("<left>", "The left operand").argParser(parseOperand))
  .addArgument(new Argument("<operator>", "The operator to apply").choices(operators))
  .addArgument(new Argument("<right>", "The right operand").argParser(parseOperand))
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
