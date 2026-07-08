import { Command } from "commander";
import { calculate, currentText } from "./cli";

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
  .command("calc <left> <operator> <right>")
  .description("Calculate a result from two numbers and an operator")
  .action((leftStr, operator, rightStr) => {
    const left = Number(leftStr);
    const right = Number(rightStr);
    if (isNaN(left)) {
      console.error("error: argument 'left' must be a number");
      process.exit(1);
    }
    if (isNaN(right)) {
      console.error("error: argument 'right' must be a number");
      process.exit(1);
    }
    const validOperators = ["+", "-", "*", "/", "%"];
    if (!validOperators.includes(operator)) {
      console.error(`error: argument 'operator' must be one of: ${validOperators.join(", ")}`);
      process.exit(1);
    }
    console.log(calculate(left, operator as any, right));
  });

// If no command is provided, display help and exit
if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(1);
}

program.parse(process.argv);
