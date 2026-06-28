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
  .argument("<left>", "left operand", (val) => {
    const num = Number(val);
    if (isNaN(num)) {
      throw new InvalidArgumentError("left must be a number");
    }
    return num;
  })
  .argument("<operator>", "operator", (val) => {
    if (!["+", "-", "*", "/"].includes(val)) {
      throw new InvalidArgumentError("operator must be one of +, -, *, /");
    }
    return val;
  })
  .argument("<right>", "right operand", (val) => {
    const num = Number(val);
    if (isNaN(num)) {
      throw new InvalidArgumentError("right must be a number");
    }
    return num;
  })
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

// Emulate yargs.demandCommand(1)
if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);
