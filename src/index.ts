import { Command } from "commander";
import { calculate, currentText } from "./cli";

const program = new Command();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

function parseOperator(value: string) {
  const choices = ["+", "-", "*", "/"];
  if (!choices.includes(value)) {
    throw new Error(`Allowed choices are ${choices.join(", ")}.`);
  }
  return value;
}

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "Left operand", parseFloat)
  .argument("<operator>", "Operator", parseOperator)
  .argument("<right>", "Right operand", parseFloat)
  .action((left, operator, right) => {
    console.log(calculate(left, operator as any, right));
  });

program.parse(process.argv);