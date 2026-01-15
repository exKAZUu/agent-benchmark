import { program, Argument } from "commander";
import { calculate, currentText, type Operator } from "./cli";

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
  .addArgument(new Argument("<left>", "left operand").argParser(parseFloat))
  .addArgument(new Argument("<operator>", "operator").choices(["+", "-", "*", "/"]))
  .addArgument(new Argument("<right>", "right operand").argParser(parseFloat))
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();

if (process.argv.length < 3) {
  program.help();
}