"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(line) {
        this.line = line;
    }
    getLine() {
        return this.line;
    }
}
exports.Command = Command;
