"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocksCommand = void 0;
const Command_1 = require("./Command");
class BlocksCommand extends Command_1.Command {
    execute() {
        this.cmds.forEach((cmd) => cmd.execute());
    }
    constructor(line, cmds) {
        super(line);
        this.cmds = cmds;
    }
}
exports.BlocksCommand = BlocksCommand;
