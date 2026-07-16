import { Command } from "commander";
import { calculate, currentText } from "./cli";
import type { Operator } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark CLI for coding agents");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc <left> <operator> <right>")
  .description("Calculate a result from two numbers and an operator")
  .action((leftStr, operator, rightStr) => {
    const left = Number(leftStr);
    const right = Number(rightStr);

    if (isNaN(left)) {
      console.error(`Error: Invalid number for 'left': ${leftStr}`);
      process.exit(1);
    }
    if (isNaN(right)) {
      console.error(`Error: Invalid number for 'right': ${rightStr}`);
      process.exit(1);
    }

    const validOperators = ["+", "-", "*", "/"];
    if (!validOperators.includes(operator)) {
      console.error(`Error: Invalid operator: ${operator}. Must be one of +, -, *, /`);
      process.exit(1);
    }

    console.log(calculate(left, operator as Operator, right));
  });

// Emulate yargs demandCommand(1) behavior: if no arguments/subcommand are provided, show help and exit with code 1.
if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(1);
}

program.parse(process.argv);
