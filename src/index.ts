import { Command } from "commander";
import { calculate, currentText } from "./cli";
import type { Operator } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .showHelpAfterError()
  .helpOption("-h, --help", "display help for command");

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

    if (isNaN(left) || isNaN(right)) {
      console.error("Error: left and right must be valid numbers");
      process.exit(1);
    }

    const validOperators: Operator[] = ["+", "-", "*", "/", "%"];
    if (!validOperators.includes(operatorStr as Operator)) {
      console.error(`error: command-argument value '${operatorStr}' is invalid for argument 'operator'`);
      console.error("must be one of +, -, *, /, %");
      process.exit(1);
    }

    console.log(calculate(left, operatorStr as Operator, right));
  });

// If no arguments or command specified, print help to stderr and exit with 1
if (process.argv.length <= 2) {
  program.help({ error: true });
}

program.parse(process.argv);
