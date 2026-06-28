import { Command } from "commander";
import { calculate, type Operator, currentText } from "./cli";

const program = new Command();

program.name("agent-benchmark").description("A benchmark for coding agents");

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "left operand", Number.parseFloat)
  .argument("<operator>", "one of + - * /")
  .argument("<right>", "right operand", Number.parseFloat)
  .action((left: number, operator: string, right: number) => {
    if (operator !== "+" && operator !== "-" && operator !== "*" && operator !== "/") {
      program.error(`error: invalid operator '${operator}', expected one of + - * /`);
    }

    console.log(calculate(left, operator as Operator, right));
  });

program.parse();
