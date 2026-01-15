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
  .command("calc <left> <operator> <right>")
  .description("Calculate a result from two numbers and an operator")
  .action((leftStr, operator, rightStr) => {
    const left = parseFloat(leftStr);
    const right = parseFloat(rightStr);

    // Validation (maintain parity with yargs strict choices/types)
    if (isNaN(left)) {
      console.error("Argument 'left' must be a number");
      process.exit(1);
    }
    if (isNaN(right)) {
      console.error("Argument 'right' must be a number");
      process.exit(1);
    }
    if (!["+", "-", "*", "/"].includes(operator)) {
      console.error("Argument 'operator' must be one of: +, -, *, /");
      process.exit(1);
    }

    console.log(calculate(left, operator as any, right));
  });

program.parse(process.argv);