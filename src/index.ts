import { Argument, Command, CommanderError, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const operators: Operator[] = ["+", "-", "*", "/", "%"];

function parseNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new InvalidArgumentError(`'${value}' is not a number.`);
  }
  return parsed;
}

const program = new Command();

program.name("agent-benchmark");

// Commander exits via `process.exit()` right after writing help or an error message, which can
// discard output that is still buffered when stdout/stderr are pipes. Set the exit code instead so
// the process ends only once its output has been flushed.
program.exitOverride();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .argument("<left>", "Left operand", parseNumber)
  .addArgument(new Argument("<operator>", "Operator").choices(operators))
  .argument("<right>", "Right operand", parseNumber)
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

try {
  program.parse();
} catch (error) {
  if (!(error instanceof CommanderError)) throw error;
  process.exitCode = error.exitCode;
}
