import { Argument, Command, InvalidArgumentError } from "commander";
import { calculate, currentText, operators, type Operator } from "./cli";

function parseNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new InvalidArgumentError(`'${value}' is not a number.`);
  }
  return parsed;
}

const program = new Command();

program.name("agent-benchmark");

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

// The README documents `bun run src/index.ts` as the way to run the project, so a
// bare invocation greets. `hello` is not registered as commander's default command
// because that would swallow unknown commands as its arguments.
const args = process.argv.slice(2);
program.parse(args.length > 0 ? args : ["hello"], { from: "user" });
