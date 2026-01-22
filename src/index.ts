import { Command, Argument } from "commander";
import { calculate, currentText } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "left operand", parseFloat)
  .addArgument(
    new Argument("<operator>", "operator").choices(["+", "-", "*", "/"])
  )
  .argument("<right>", "right operand", parseFloat)
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

program.parse();

if (process.argv.length < 3) {
  program.help();
}