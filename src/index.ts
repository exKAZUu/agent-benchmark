import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const parseNumber = (value: string): number => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsed;
};

const parseOperator = (value: string): Operator => {
  if (value !== "+" && value !== "-" && value !== "*" && value !== "/") {
    throw new InvalidArgumentError("Operator must be one of +, -, *, /.");
  }
  return value;
};

const program = new Command();

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
  .argument("<left>", "left operand", parseNumber)
  .argument("<operator>", "operator (+, -, *, /)", parseOperator)
  .argument("<right>", "right operand", parseNumber)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse(process.argv);
