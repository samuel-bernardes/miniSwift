"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimitiveType = void 0;
const Type_1 = require("../Type"); // Substitua './type' pelo caminho correto do seu módulo de tipo
const BoolType_1 = require("./BoolType");
const FloatType_1 = require("./FloatType");
const IntType_1 = require("./IntType");
const StringType_1 = require("./StringType");
const CharType_1 = require("./CharType");
class PrimitiveType extends Type_1.Type {
    constructor(classification) {
        super(classification);
    }
    static instance(classification) {
        switch (classification) {
            case Type_1.Category.Bool:
                return BoolType_1.BoolType.instance();
            case Type_1.Category.Int:
                return IntType_1.IntType.instance();
            case Type_1.Category.Float:
                return FloatType_1.FloatType.instance();
            case Type_1.Category.Char:
                return CharType_1.CharType.instance();
            case Type_1.Category.String:
                return StringType_1.StringType.instance();
            default:
                throw new Error('TypeException');
        }
    }
}
exports.PrimitiveType = PrimitiveType;
