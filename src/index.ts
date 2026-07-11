import { Argument, Command } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const program = new Command();

program.name("agent-benchmark").description("A benchmark for coding agents");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .addArgument(new Argument("<left>", "The left operand").argParser(Number))
  .addArgument(new Argument("<operator>", "The operator").choices(["+", "-", "*", "/"]))
  .addArgument(new Argument("<right>", "The right operand").argParser(Number))
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();
