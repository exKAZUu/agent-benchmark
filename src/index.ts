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
    const numLeft = Number(left);
    const numRight = Number(right);
    if (isNaN(numLeft) || isNaN(numRight)) {
      console.error("error: left and right must be numbers");
      process.exit(1);
    }
    if (!["+", "-", "*", "/"].includes(operator)) {
      console.error("error: operator must be one of +, -, *, /");
      process.exit(1);
    }
    console.log(calculate(numLeft, operator as any, numRight));
  });

program.parse(process.argv);

if (program.args.length === 0) {
  program.help({ error: true });
}

