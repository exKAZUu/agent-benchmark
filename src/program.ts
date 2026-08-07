import { Argument, Command, InvalidArgumentError } from "commander";
import { calculate, currentText, type Operator } from "./cli";

const operators = ["+", "-", "*", "/", "%"] as const satisfies readonly Operator[];

function parseNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new InvalidArgumentError(`'${value}' is not a number.`);
  }
  return parsed;
}

export function createProgram(): Command {
  const program = new Command()
    .name("agent-benchmark")
    .showHelpAfterError();

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

  return program;
}
