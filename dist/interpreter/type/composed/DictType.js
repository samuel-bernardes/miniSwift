"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictType = void 0;
const Type_1 = require("../Type");
const ComposedType_1 = require("./ComposedType");
class DictType extends ComposedType_1.ComposedType {
    constructor(classification, innerTypes) {
        super(Type_1.Category.Dict);
        this.keyType = innerTypes[0];
        this.valueType = innerTypes[1];
    }
    getKeyType() {
        return this.keyType;
    }
    getValueType() {
        return this.valueType;
    }
    match(type) {
        if (type instanceof DictType) {
            const dtype = type;
            return this.keyType === dtype.keyType && this.valueType === dtype.valueType;
        }
        else {
            return false;
        }
    }
    /* public hashCode(): number {
        const prime = 31;
        let result = super.hashCode();
        result = prime * result + this.keyType.hashCode();
        result = prime * result + this.valueType.hashCode();
        return result;
    } */
    equals(obj) {
        if (this === obj) {
            return true;
        }
        else if (obj instanceof DictType) {
            return this.match(obj);
        }
        else {
            return false;
        }
    }
    toString() {
        return `Dict<${this.keyType},${this.valueType}>`;
    }
    static instance(classification, innerTypes) {
        return new DictType(classification, innerTypes);
    }
}
exports.DictType = DictType;
