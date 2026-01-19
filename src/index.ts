import { Command, InvalidArgumentError } from "commander";
import { hello, calc } from "./cli";

const program = new Command();

program
    .command("hello")
    .action(() => {
        hello()
    });

program
    .command("calc")
    .argument("<left>")
    .argument("<operator>")
    .argument("<right>")
    .action((left, operator, right) => {
        if (!["+", "-", "*", "/"].includes(operator)) {
            throw new InvalidArgumentError("Operator must be one of +, -, *, /");
        }
        calc(left, operator, right);
    });

program.parse(process.argv);
