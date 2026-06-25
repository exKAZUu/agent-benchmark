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
  .argument("<left>", "left operand")
  .argument("<operator>", "operator")
  .argument("<right>", "right operand")
  .action((leftStr, operatorStr, rightStr) => {
    const left = Number(leftStr);
    const right = Number(rightStr);
    const operator = operatorStr;

    if (isNaN(left)) {
      console.error(`Error: Invalid number for left: "${leftStr}"`);
      process.exit(1);
    }
    if (!["+", "-", "*", "/"].includes(operator)) {
      console.error(`Error: Invalid operator: "${operatorStr}". Allowed operators: +, -, *, /`);
      process.exit(1);
    }
    if (isNaN(right)) {
      console.error(`Error: Invalid number for right: "${rightStr}"`);
      process.exit(1);
    }

    console.log(calculate(left, operator as any, right));
  });

// Demand a command (if none is provided, show help and exit with error)
if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(1);
}

program.parse(process.argv);
