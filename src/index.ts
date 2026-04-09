import { Command } from "commander";
import { type Operator, calculate, currentText } from "./cli";

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
  .argument("<left>", "Left operand")
  .argument("<operator>", "Operator (+, -, *, /)")
  .argument("<right>", "Right operand")
  .action((left: string, operator: string, right: string) => {
    console.log(calculate(Number(left), operator as Operator, Number(right)));
  });

program.parse();
