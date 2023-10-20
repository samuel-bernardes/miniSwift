"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const LanguageException_1 = require("../error/LanguageException");
const Variable_1 = require("./expr/Variable");
class Environment {
    constructor(enclosing) {
        this.memory = {};
        if (enclosing) {
            this.enclosing = enclosing;
        }
    }
    declare(name, type, constant) {
        if (this.memory[name.lexeme]) {
            throw LanguageException_1.LanguageException.instance(name.line, LanguageException_1.customErrors.AlreadyDeclaredVariable, name.lexeme);
        }
        let variable = new Variable_1.Variable(name, type, constant);
        this.memory[name.lexeme] = variable;
        return variable;
    }
    get(name) {
        if (this.memory[name.lexeme])
            return this.memory[name.lexeme];
        if (this.enclosing != null)
            return this.enclosing.get(name);
        throw LanguageException_1.LanguageException.instance(name.line, LanguageException_1.customErrors.UndeclaredVariable, name.lexeme);
    }
}
exports.Environment = Environment;
