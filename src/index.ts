import { Command } from "commander";
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
  .argument("<left>", "left operand", parseFloat)
  .argument(
    "<operator>",
    "operator, must be one of +, -, *, /",
    (value) => {
      if (!["+", "-", "*", "/"].includes(value)) {
        throw new Error("Invalid operator");
      }
      return value;
    },
  )
  .argument("<right>", "right operand", parseFloat)
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

program.parse(process.argv);
