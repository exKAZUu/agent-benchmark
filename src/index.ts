import { Command, Argument, InvalidArgumentError } from "commander";
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
  .addArgument(
    new Argument("<left>", "left operand").argParser((val) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        throw new InvalidArgumentError("must be a number");
      }
      return parsed;
    })
  )
  .addArgument(new Argument("<operator>", "operator").choices(["+", "-", "*", "/"]))
  .addArgument(
    new Argument("<right>", "right operand").argParser((val) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        throw new InvalidArgumentError("must be a number");
      }
      return parsed;
    })
  )
  .action((left: number, operator: "+" | "-" | "*" | "/", right: number) => {
    console.log(calculate(left, operator, right));
  });

// Handle default/missing command
if (process.argv.length <= 2) {
  program.help({ error: true });
}

program.parse(process.argv);
