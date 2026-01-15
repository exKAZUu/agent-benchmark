import { Command } from "commander";
import { calculate, currentText } from "./cli";

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .version("1.0.0");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .argument("<left>", "Left operand", parseFloat)
  .argument("<operator>", "Operator (+, -, *, /)")
  .argument("<right>", "Right operand", parseFloat)
  .description("Calculate a result from two numbers and an operator")
  .action((left, operator, right) => {
    if (!["+", "-", "*", "/"].includes(operator)) {
      console.error("Invalid operator. Allowed: +, -, *, /");
      process.exit(1);
    }
    
    if (isNaN(left) || isNaN(right)) {
       console.error("Operands must be numbers");
       process.exit(1);
    }

    console.log(calculate(left, operator as any, right));
  });

program.parse(process.argv);