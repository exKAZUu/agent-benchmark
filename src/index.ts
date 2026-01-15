import { Command, Argument } from "commander";
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
  .argument("<left>", "left operand", parseFloat)
  .addArgument(
    new Argument("<operator>", "operator").choices(["+", "-", "*", "/"])
  )
  .argument("<right>", "right operand", parseFloat)
  .description("Calculate a result from two numbers and an operator")
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

program.parse(process.argv);

if (process.argv.length === 2) {
  program.help();
}