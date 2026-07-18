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
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "Left operand")
  .argument("<operator>", "Operator (+, -, *, /)")
  .argument("<right>", "Right operand")
  .action((leftStr, operatorStr, rightStr) => {
    const left = parseFloat(leftStr);
    const right = parseFloat(rightStr);
    const operator = operatorStr as "+" | "-" | "*" | "/";

    if (isNaN(left)) {
      program.error("error: left must be a number");
    }
    if (isNaN(right)) {
      program.error("error: right must be a number");
    }
    if (!["+", "-", "*", "/"].includes(operator)) {
      program.error("error: operator must be one of +, -, *, /");
    }

    console.log(calculate(left, operator, right));
  });

// Handle cases where no command is provided
program.action(() => {
  program.help();
});

program.parse(process.argv);

if (process.argv.length <= 2) {
  program.help();
}
