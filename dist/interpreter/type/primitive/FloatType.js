"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatType = void 0;
const Type_1 = require("../Type"); // Substitua './type' pelo caminho correto do seu módulo de tipo
const PrimitiveType_1 = require("./PrimitiveType");
class FloatType extends PrimitiveType_1.PrimitiveType {
    constructor() {
        super(Type_1.Category.Float);
    }
    match(type) {
        return type === FloatType.type;
    }
    toString() {
        return 'Float';
    }
    static instance() {
        return FloatType.type;
    }
}
exports.FloatType = FloatType;
FloatType.type = new FloatType();
