import { Command } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const program = new Command();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc <left> <operator> <right>")
  .description("Calculate a result from two numbers and an operator")
  .action((left: string, operator: string, right: string) => {
    const l = Number(left);
    const r = Number(right);
    const op = operator as Operator;

    console.log(calculate(l, op, r));
  });

program.parse();
