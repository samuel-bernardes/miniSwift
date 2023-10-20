"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DumpCommand = void 0;
const Command_1 = require("./Command");
class DumpCommand extends Command_1.Command {
    constructor(line, expr) {
        super(line);
        this.expr = expr;
    }
    execute() {
        let value = this.expr.expr();
        console.log(value);
    }
}
exports.DumpCommand = DumpCommand;
