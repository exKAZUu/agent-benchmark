import { Command } from "commander";
import { calculate, currentText } from "./cli";

const program = new Command();

program
  .name("cli")
  .description("A CLI tool for testing benchmark calculations")
  .version("1.0.0");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc <left> <operator> <right>")
  .description("Calculate a result from two numbers and an operator")
  .action((leftStr, operatorStr, rightStr) => {
    const left = Number(leftStr);
    if (isNaN(left)) {
      console.error("Error: left must be a number");
      process.exit(1);
    }
    const right = Number(rightStr);
    if (isNaN(right)) {
      console.error("Error: right must be a number");
      process.exit(1);
    }
    const validOperators = ["+", "-", "*", "/"];
    if (!validOperators.includes(operatorStr)) {
      console.error(`Error: operator must be one of ${validOperators.join(", ")}`);
      process.exit(1);
    }
    const operator = operatorStr as "+" | "-" | "*" | "/";

    console.log(calculate(left, operator, right));
  });

program.parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp({ error: true });
  process.exit(1);
}

