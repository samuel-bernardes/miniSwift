"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const Environment_1 = require("./Environment");
class Interpreter {
    static interpret(cmd) {
        cmd.execute();
    }
}
exports.Interpreter = Interpreter;
(() => {
    Interpreter.globals = new Environment_1.Environment();
})();
