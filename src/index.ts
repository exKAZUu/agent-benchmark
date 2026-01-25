import { Command, Argument } from "commander";
import { calculate, currentText } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  // .version(...) // Optional, based on package.json

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .addArgument(new Argument("<left>", "Left operand").argParser(Number))
  .addArgument(new Argument("<operator>", "Operator").choices(["+", "-", "*", "/"]))
  .addArgument(new Argument("<right>", "Right operand").argParser(Number))
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

program.parse();

// Mimic .demandCommand(1) from yargs
if (process.argv.length < 3) {
  program.help();
}