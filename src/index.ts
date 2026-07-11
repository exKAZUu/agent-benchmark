import { Command } from "commander";
import { calculate, currentText, Operator } from "./cli";

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
  .action((leftStr, operatorStr, rightStr) => {
    const left = Number(leftStr);
    const right = Number(rightStr);
    const operator = operatorStr as Operator;
    const validOperators = ["+", "-", "*", "/", "%"];

    if (isNaN(left) || leftStr === "" || isNaN(Number(leftStr))) {
      console.error("error: Left operand must be a number");
      process.exit(1);
    }
    if (!validOperators.includes(operatorStr)) {
      console.error(`error: Operator must be one of ${validOperators.join(", ")} (invalid operator)`);
      process.exit(1);
    }
    if (isNaN(right) || rightStr === "" || isNaN(Number(rightStr))) {
      console.error("error: Right operand must be a number");
      process.exit(1);
    }

    console.log(calculate(left, operator, right));
  });

program.parse(process.argv);

if (process.argv.length <= 2) {
  console.error(program.helpInformation());
  process.exit(1);
}
