"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntType = void 0;
const Type_1 = require("../../Type"); // Substitua './type' pelo caminho correto do seu módulo de tipo
const PrimitiveType_1 = require("../PrimitiveType");
class IntType extends PrimitiveType_1.PrimitiveType {
    constructor() {
        super(Type_1.Category.Int);
    }
    match(type) {
        return type === IntType.type;
    }
    toString() {
        return 'Int';
    }
    static instance() {
        return IntType.type;
    }
}
exports.IntType = IntType;
IntType.type = new IntType();
