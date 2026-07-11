import { Command } from "commander";
import { calculate, currentText } from "./cli";

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
  .action((leftStr, operatorStr, rightStr) => {
    const left = Number(leftStr);
    const right = Number(rightStr);

    if (isNaN(left)) {
      console.error(`Error: "${leftStr}" is not a number.`);
      process.exit(1);
    }
    if (isNaN(right)) {
      console.error(`Error: "${rightStr}" is not a number.`);
      process.exit(1);
    }

    const validOperators = ["+", "-", "*", "/", "%"];
    if (!validOperators.includes(operatorStr)) {
      console.error(`Error: Invalid operator "${operatorStr}". Allowed operators: ${validOperators.join(", ")}`);
      process.exit(1);
    }

    const operator = operatorStr as "+" | "-" | "*" | "/" | "%";
    console.log(calculate(left, operator, right));
  });

// Handle cases where no arguments or unknown commands are provided
program.on("command:*", () => {
  console.error("Invalid command");
  program.outputHelp();
  process.exit(1);
});

program.parse(process.argv);

if (process.argv.slice(2).length === 0) {
  program.outputHelp();
  process.exit(1);
}
