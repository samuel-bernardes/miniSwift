"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
const LanguageException_1 = require("../../error/LanguageException");
const SetExpr_1 = require("./SetExpr");
const LanguageException_2 = require("../../error/LanguageException");
class Variable extends SetExpr_1.SetExpr {
    constructor(name, type, constant) {
        super(name.line);
        this.name = name.lexeme;
        this.type = type;
        this.constant = constant;
        this.value = null;
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    isConstant() {
        return this.constant;
    }
    initialize(value) {
        this.write(value, true);
    }
    expr() {
        if (this.value == null)
            throw LanguageException_1.LanguageException.instance(super.getLine(), LanguageException_2.customErrors.UndeclaredVariable, this.name);
        return this.value;
    }
    setValue(value) {
        this.write(value, false);
    }
    write(value, initialize) {
        if (!initialize && this.isConstant())
            throw LanguageException_1.LanguageException.instance(super.getLine(), LanguageException_2.customErrors.ConstantAssignment, this.name);
        if (!this.type.match(value.type))
            throw LanguageException_1.LanguageException.instance(super.getLine(), LanguageException_2.customErrors.InvalidType, value.type.toString());
        this.value = value;
    }
}
exports.Variable = Variable;
