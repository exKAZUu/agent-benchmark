import { Command } from "commander";
import { type Operator, calculate, currentText } from "./cli";

const program = new Command();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "left operand")
  .argument("<operator>", "operator (+, -, *, /)")
  .argument("<right>", "right operand")
  .action((left: string, operator: string, right: string) => {
    console.log(calculate(Number(left), operator as Operator, Number(right)));
  });

program.parse();
