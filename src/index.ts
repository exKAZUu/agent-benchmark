import { Argument, Command } from "commander";
import { calculate, currentText, type Operator } from "./cli";

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
  .addArgument(new Argument("<left>", "left operand").argParser(Number))
  .addArgument(new Argument("<operator>", "operator").choices(["+", "-", "*", "/", "%"]))
  .addArgument(new Argument("<right>", "right operand").argParser(Number))
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse();

if (program.args.length === 0) {
  program.outputHelp();
  process.exit(1);
}
