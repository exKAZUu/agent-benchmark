import { Argument, Command } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const program = new Command();

program.name("agent-benchmark");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "The left operand", Number)
  .addArgument(new Argument("<operator>", "The operator").choices(["+", "-", "*", "/"]))
  .argument("<right>", "The right operand", Number)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
