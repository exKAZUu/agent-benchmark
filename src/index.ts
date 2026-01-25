import { Command } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const program = new Command();

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
  .action((leftStr: string, operatorStr: string, rightStr: string) => {
    const left = Number(leftStr);
    const right = Number(rightStr);

    if (isNaN(left)) {
      console.error("error: left operand must be a number");
      process.exit(1);
    }

    if (isNaN(right)) {
      console.error("error: right operand must be a number");
      process.exit(1);
    }

    const validOperators = ["+", "-", "*", "/"];
    if (!validOperators.includes(operatorStr)) {
      console.error('error: operator must be one of "+", "-", "*", "/"');
      process.exit(1);
    }

    console.log(calculate(left, operatorStr as Operator, right));
  });

program.parse(process.argv);

// Mimic .demandCommand(1) behavior: show help if no command provided
if (process.argv.length < 3) {
  program.help();
}