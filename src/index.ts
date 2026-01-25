import { Command, Argument } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .version("1.0.0");

program.command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program.command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "Left operand", parseFloat)
  .addArgument(new Argument("<operator>", "Operator").choices(["+", "-", "*", "/"]))
  .argument("<right>", "Right operand", parseFloat)
  .action((left, operator, right) => {
    console.log(calculate(left, operator as Operator, right));
  });

program.parse();