import { Command } from "commander";
import { calculate, currentText } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
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
    const right = Number(rightStr);

    if (isNaN(left)) {
      console.error("error: left must be a number");
      process.exit(1);
    }
    if (isNaN(right)) {
      console.error("error: right must be a number");
      process.exit(1);
    }
    if (!["+", "-", "*", "/"].includes(operatorStr)) {
      console.error("error: operator must be one of: +, -, *, /");
      process.exit(1);
    }

    console.log(calculate(left, operatorStr as "+" | "-" | "*" | "/", right));
  });

// If no arguments or commands are provided, show help and exit with 1
if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(1);
}

program.parse(process.argv);

