"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimitiveType = void 0;
const Type_1 = require("../Type");
const types_1 = require("./types");
class PrimitiveType extends Type_1.Type {
    constructor(classification) {
        super(classification);
    }
    static instance(classification) {
        switch (classification) {
            case Type_1.Category.Bool:
                return types_1.PrimitiveTypes.BoolType.instance();
            case Type_1.Category.Int:
                return types_1.PrimitiveTypes.IntType.instance();
            case Type_1.Category.Float:
                return types_1.PrimitiveTypes.FloatType.instance();
            case Type_1.Category.Char:
                return types_1.PrimitiveTypes.CharType.instance();
            case Type_1.Category.String:
                return types_1.PrimitiveTypes.StringType.instance();
            default:
                throw new Error('TypeException');
        }
    }
}
exports.PrimitiveType = PrimitiveType;
