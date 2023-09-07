"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharType = void 0;
const Type_1 = require("../Type"); // Substitua './type' pelo caminho correto do seu módulo de tipo
const PrimitiveType_1 = require("./PrimitiveType");
class CharType extends PrimitiveType_1.PrimitiveType {
    constructor() {
        super(Type_1.Category.Char);
    }
    match(type) {
        return type === CharType.type;
    }
    toString() {
        return 'Char';
    }
    static instance() {
        return CharType.type;
    }
}
exports.CharType = CharType;
CharType.type = new CharType();
