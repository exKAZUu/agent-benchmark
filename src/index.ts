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
  .action((left, operator, right) => {
    const leftNum = Number(left);
    const rightNum = Number(right);

    if (isNaN(leftNum) || isNaN(rightNum)) {
      console.error("error: left and right arguments must be numbers");
      process.exit(1);
    }

    if (operator !== "+" && operator !== "-" && operator !== "*" && operator !== "/") {
      console.error("error: operator must be +, -, *, or /");
      process.exit(1);
    }

    console.log(calculate(leftNum, operator, rightNum));
  });

program.parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp();
  process.exit(1);
}

