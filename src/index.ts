import { Command } from "commander";
import { calculate, currentText } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .helpOption("-h, --help", "display help for command");

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
  .action((leftStr, operatorStr, rightStr) => {
    const left = Number(leftStr);
    const right = Number(rightStr);

    if (isNaN(left)) {
      console.error(`error: argument 'left' must be a number`);
      process.exit(1);
    }
    if (isNaN(right)) {
      console.error(`error: argument 'right' must be a number`);
      process.exit(1);
    }
    const validOperators = ["+", "-", "*", "/"];
    if (!validOperators.includes(operatorStr)) {
      console.error(`error: argument 'operator' must be one of: +, -, *, /`);
      process.exit(1);
    }

    console.log(calculate(left, operatorStr as "+" | "-" | "*" | "/", right));
  });

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}

