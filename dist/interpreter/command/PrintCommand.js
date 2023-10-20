"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintCommand = void 0;
const Command_1 = require("./Command");
class PrintCommand extends Command_1.Command {
    constructor(line, expr, newline) {
        super(line);
        this.expr = expr;
        this.newline = newline;
    }
    execute() {
        let value = this.expr.expr();
        console.log(value.data);
        if (this.newline)
            console.log("");
    }
}
exports.PrintCommand = PrintCommand;
