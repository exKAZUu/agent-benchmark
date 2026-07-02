import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const operators: Operator[] = ["+", "-", "*", "/"];

function parseOperator(value: string): Operator {
  if (!operators.includes(value as Operator)) {
    throw new InvalidArgumentError(`Allowed choices are ${operators.join(", ")}.`);
  }
  return value as Operator;
}

const program = new Command();

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
  .argument("<left>", "left operand", Number)
  .argument("<operator>", "one of +, -, *, /", parseOperator)
  .argument("<right>", "right operand", Number)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
