import { Command, Argument } from "commander";
import { calculate, currentText } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .version("1.0.0");

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
    new Argument("<left>", "Left operand").argParser((value) => {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) throw new Error("Not a number");
      return parsed;
    }),
  )
  .addArgument(
    new Argument("<operator>", "Operator").choices(["+", "-", "*", "/"]),
  )
  .addArgument(
    new Argument("<right>", "Right operand").argParser((value) => {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) throw new Error("Not a number");
      return parsed;
    }),
  )
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

program.parse();