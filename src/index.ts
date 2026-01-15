import { Command, Argument } from "commander";
import { calculate, currentText } from "./cli";

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
  // Define arguments
  .addArgument(new Argument("<left>", "Left number").argParser(parseFloat))
  .addArgument(
    new Argument("<operator>", "Operator").choices(["+", "-", "*", "/"])
  )
  .addArgument(new Argument("<right>", "Right number").argParser(parseFloat))
  .action((left, operator, right) => {
    // 'left' and 'right' are parsed as numbers by argParser
    // 'operator' is validated by choices
    console.log(calculate(left, operator, right));
  });

// strict() is default in commander for unknown options/commands usually.
program.parse(process.argv);

// Optional: Mimic .demandCommand(1) behavior if needed (not explicitly required by tests but good practice)
if (process.argv.length < 3) {
  program.help();
}