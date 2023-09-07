"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposedType = void 0;
const Type_1 = require("../Type"); // Substitua './type' pelo caminho correto do seu módulo de tipo
const TypeException_1 = require("../TypeException");
const ArrayType_1 = require("./ArrayType"); // Substitua './arraytype' pelo caminho correto do seu módulo de ArrayType
const DictType_1 = require("./DictType"); // Substitua './dicttype' pelo caminho correto do seu módulo de DictType
class ComposedType extends Type_1.Type {
    constructor(classification) {
        super(classification);
    }
    static instance(classification, innerTypes) {
        switch (classification) {
            case Type_1.Category.Array:
                if (innerTypes.length === 1) {
                    return ArrayType_1.ArrayType.instance(classification, innerTypes);
                }
            case Type_1.Category.Dict:
                if (innerTypes.length === 2) {
                    return DictType_1.DictType.instance(classification, innerTypes);
                }
            default:
                throw new TypeException_1.TypeException;
        }
    }
}
exports.ComposedType = ComposedType;
