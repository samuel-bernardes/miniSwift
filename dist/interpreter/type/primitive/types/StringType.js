"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringType = void 0;
const Type_1 = require("../../Type"); // Substitua './type' pelo caminho correto do seu módulo de tipo
const PrimitiveType_1 = require("../PrimitiveType");
class StringType extends PrimitiveType_1.PrimitiveType {
    constructor() {
        super(Type_1.Category.String);
    }
    match(type) {
        return type === StringType.type;
    }
    toString() {
        return 'String';
    }
    static instance() {
        return StringType.type;
    }
}
exports.StringType = StringType;
StringType.type = new StringType();
