"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignCommand = void 0;
const Command_1 = require("./Command");
class AssignCommand extends Command_1.Command {
    constructor(line, rhs, lhs) {
        super(line);
        this.rhs = rhs;
        this.lhs = lhs;
    }
    execute() {
        let v = this.rhs.expr();
        if (this.lhs != null)
            this.lhs.setValue(v);
    }
}
exports.AssignCommand = AssignCommand;
