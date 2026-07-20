import { Command } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const program = new Command();

program
  .name("bun")
  .description("A CLI tool to print greetings or perform mathematical calculations");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc <left> <operator> <right>")
  .description("Calculate a result from two numbers and an operator")
  .action((leftStr: string, operator: string, rightStr: string) => {
    const left = Number(leftStr);
    const right = Number(rightStr);

    if (Number.isNaN(left)) {
      console.error(`error: argument 'left' must be a number`);
      process.exit(1);
    }
    if (!["+", "-", "*", "/"].includes(operator)) {
      console.error(`error: argument 'operator' must be one of "+", "-", "*", "/"`);
      process.exit(1);
    }
    if (Number.isNaN(right)) {
      console.error(`error: argument 'right' must be a number`);
      process.exit(1);
    }

    console.log(calculate(left, operator as Operator, right));
  });

program.parse(process.argv);

if (program.args.length === 0) {
  process.stderr.write(program.helpInformation());
  process.exit(1);
}
