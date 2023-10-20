"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayType = void 0;
const Type_1 = require("../Type"); // Substitua './type' pelo caminho correto do seu módulo de tipo
const ComposedType_1 = require("./ComposedType");
class ArrayType extends ComposedType_1.ComposedType {
    constructor(classification, innerType) {
        super(Type_1.Category.Array);
        this.innerType = innerType[0];
    }
    getInnerType() {
        return this.innerType;
    }
    match(type) {
        if (type instanceof ArrayType) {
            const atype = type;
            return this.innerType === atype.innerType;
        }
        else {
            return false;
        }
    }
    /* public hashCode(): number {
        return super.hashCode() * 17 + this.innerType.hashCode();
    } */
    hashCode(str) {
        var h = 0;
        for (var i = 0; i < str.length; i++) {
            h = 31 * h + str.charCodeAt(i);
        }
        return h & 0xFFFFFFFF;
    }
    equals(obj) {
        if (this === obj) {
            return true;
        }
        else if (obj instanceof ArrayType) {
            return this.match(obj);
        }
        else {
            return false;
        }
    }
    toString() {
        return `Array<${this.innerType}>`;
    }
    static instance(classification, innerType) {
        return new ArrayType(classification, innerType);
    }
}
exports.ArrayType = ArrayType;
