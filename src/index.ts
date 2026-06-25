import { Command, InvalidArgumentError } from "commander";
import { calculate, currentText } from "./cli";

function parseFloatArg(value: string) {
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsedValue;
}

function parseOperatorArg(value: string) {
  const choices = ["+", "-", "*", "/"];
  if (!choices.includes(value)) {
    throw new InvalidArgumentError(`Allowed choices are ${choices.join(", ")}.`);
  }
  return value as "+" | "-" | "*" | "/";
}

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
  .argument("<left>", "left number", parseFloatArg)
  .argument("<operator>", "operator", parseOperatorArg)
  .argument("<right>", "right number", parseFloatArg)
  .action((left: number, operator: "+" | "-" | "*" | "/", right: number) => {
    console.log(calculate(left, operator, right));
  });

program.parse(process.argv);

