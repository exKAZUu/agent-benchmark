import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { Operator } from "./cli";
import { calculate, currentText } from "./cli";

yargs(hideBin(process.argv))
  .command(
    "hello",
    "Print the current text",
    () => {},
    () => {
      console.log(currentText);
    },
  )
  .command(
    "calc <left> <operator> <right>",
    "Calculate a result from two numbers and an operator",
    (cmd) =>
      cmd
        .positional("left", {
          type: "number",
          demandOption: true,
        })
        .positional("operator", {
          type: "string",
          choices: ["+", "-", "*", "/", "%"] as const,
          demandOption: true,
        })
        .positional("right", {
          type: "number",
          demandOption: true,
        }),
    (argv) => {
      const left = argv.left as number;
      const right = argv.right as number;
      const operator = argv.operator as Operator;

      console.log(calculate(left, operator, right));
    },
  )
  .demandCommand(1)
  .strict()
  .help()
  .parse();
