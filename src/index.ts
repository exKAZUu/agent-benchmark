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
  .argument("<left>", "the left-hand side of the calculation", parseFloat)
  .argument(
    "<operator>",
    "the operator to use in the calculation",
    (value) => {
      if (!["+", "-", "*", "/"].includes(value)) {
        throw new InvalidArgumentError("Operator must be one of +, -, *, /");
      }
      return value as "+" | "-" | "*" | "/";
    },
  )
  .argument("<right>", "the right-hand side of the calculation", parseFloat)
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

program.parse(process.argv);
