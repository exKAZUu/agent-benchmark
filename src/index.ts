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
  .description("Calculate a result from two numbers and an operator")
  .addArgument(new Argument("<left>", "Left operand").argParser(parseFloat))
  .addArgument(
    new Argument("<operator>", "Operator").choices(["+", "-", "*", "/"])
  )
  .addArgument(new Argument("<right>", "Right operand").argParser(parseFloat))
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

program.parse();

if (process.argv.length < 3) {
  program.help();
}