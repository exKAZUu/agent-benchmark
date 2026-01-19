import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText } from "./cli";

const program = new Command();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "the left operand", (value) => {
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      throw new InvalidArgumentError("Not a number.");
    }
    return parsedValue;
  })
  .argument(
    "<operator>",
    "the operator, must be one of +, -, *, /",
    (value) => {
      if (!["+", "-", "*", "/"].includes(value)) {
        throw new InvalidArgumentError("Not a valid operator.");
      }
      return value as "+" | "-" | "*" | "/";
    },
  )
  .argument("<right>", "the right operand", (value) => {
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      throw new InvalidArgumentError("Not a number.");
    }
    return parsedValue;
  })
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

program.parse(process.argv);