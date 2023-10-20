"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoolType = void 0;
const Type_1 = require("../../Type");
const PrimitiveType_1 = require("../PrimitiveType");
class BoolType extends PrimitiveType_1.PrimitiveType {
    constructor() {
        super(Type_1.Category.Bool);
    }
    match(type) {
        return type === BoolType.type;
    }
    toString() {
        return 'Bool';
    }
    static instance() {
        return BoolType.type;
    }
}
exports.BoolType = BoolType;
BoolType.type = new BoolType();
