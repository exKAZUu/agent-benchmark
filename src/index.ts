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
  .argument("<left>", "Left operand (number)")
  .argument("<operator>", "Operator (+, -, *, /)")
  .argument("<right>", "Right operand (number)")
  .action((leftStr, operator, rightStr) => {
    const left = Number(leftStr);
    const right = Number(rightStr);

    if (isNaN(left)) {
      program.error("error: left operand must be a number");
    }

    const validOperators = ["+", "-", "*", "/"];
    if (!validOperators.includes(operator)) {
      program.error(`error: operator must be one of ${validOperators.join(", ")}`);
    }

    if (isNaN(right)) {
      program.error("error: right operand must be a number");
    }

    console.log(calculate(left, operator as "+" | "-" | "*" | "/", right));
  });

program.parse(process.argv);

if (process.argv.length <= 2) {
  program.help();
}
