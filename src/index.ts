import { Command, Argument, InvalidArgumentError } from "commander";
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
  .description("Calculate a result from two numbers and an operator")
  .addArgument(
    new Argument("<left>", "left number").argParser((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        throw new InvalidArgumentError("must be a number");
      }
      return parsed;
    })
  )
  .addArgument(
    new Argument("<operator>", "operator").choices(["+", "-", "*", "/"])
  )
  .addArgument(
    new Argument("<right>", "right number").argParser((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        throw new InvalidArgumentError("must be a number");
      }
      return parsed;
    })
  )
  .action((left, operator, right) => {
    console.log(calculate(left, operator, right));
  });

// If no command is specified, print help and exit
if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(1);
}

program.parse(process.argv);


