import { Command, Argument } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const program = new Command();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .addArgument(new Argument("<left>", "Left operand").argParser(parseFloat))
  .addArgument(
    new Argument("<operator>", "Operator").choices(["+", "-", "*", "/"])
  )
  .addArgument(new Argument("<right>", "Right operand").argParser(parseFloat))
  .description("Calculate a result from two numbers and an operator")
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse(process.argv);
