import { Argument, Command, CommanderError, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const operators: Operator[] = ["+", "-", "*", "/"];

function parseNumber(value: string): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new InvalidArgumentError("must be a number");
  }

  return parsed;
}

const program = new Command();

program
  .name("agent-benchmark")
  .description("A benchmark for coding agents")
  .showHelpAfterError()
  .showSuggestionAfterError()
  .exitOverride();

program
  .command("hello")
  .description("Print the current text")
  .action(() => {
    console.log(currentText);
  });

program
  .command("calc")
  .description("Calculate a result from two numbers and an operator")
  .addArgument(new Argument("<left>").argParser(parseNumber))
  .addArgument(new Argument("<operator>").choices(operators))
  .addArgument(new Argument("<right>").argParser(parseNumber))
  .action((left: number, operator: Operator, right: number) => {
    console.log(calculate(left, operator, right));
  });

try {
  if (process.argv.length <= 2) {
    program.help({ error: true });
  }

  program.parse();
} catch (error) {
  if (error instanceof CommanderError) {
    process.exitCode = error.exitCode;
  } else {
    throw error;
  }
}
