import { Command, Argument } from "commander";
import { calculate, currentText } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .showHelpAfterError();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "Left operand", parseFloat)
  .addArgument(
    new Argument("<operator>", "Operator").choices(["+", "-", "*", "/"])
  )
  .argument("<right>", "Right operand", parseFloat)
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

program.parse();