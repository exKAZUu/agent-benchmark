import { Command, Argument } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("A CLI tool for agent benchmarking");

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
    console.log(calculate(left, operator as Operator, right));
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(1);
}