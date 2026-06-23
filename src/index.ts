import { Command } from "commander";
import { calculate, currentText } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("CLI for calculating and printing")
  .version("1.0.0");

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
    const left = Number(leftStr);
    const right = Number(rightStr);

    if (isNaN(left)) {
      console.error("Error: left operand must be a number");
      process.exit(1);
    }
    if (!["+", "-", "*", "/"].includes(operator)) {
      console.error('Error: operator must be one of "+", "-", "*", "/"');
      process.exit(1);
    }
    if (isNaN(right)) {
      console.error("Error: right operand must be a number");
      process.exit(1);
    }

    console.log(calculate(left, operator as "+" | "-" | "*" | "/", right));
  });

program.on("command:*", () => {
  console.error("Error: Invalid command");
  program.outputHelp();
  process.exit(1);
});

program.parse(process.argv);

if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(1);
}
