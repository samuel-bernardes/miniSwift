"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Value = void 0;
const InternalException_1 = require("../../error/InternalException");
const Type_1 = require("../type/Type");
class Value {
    constructor(type, data) {
        switch (type.getCategory()) {
            case Type_1.Category.Bool:
                if (typeof data !== 'boolean') {
                    throw new Error('Valor de tipo incorreto para Bool');
                }
                break;
            case Type_1.Category.Int:
                if (typeof data !== 'number' || !Number.isInteger(data)) {
                    throw new Error('Valor de tipo incorreto para Int');
                }
                break;
            case Type_1.Category.Float:
                if (typeof data !== 'number') {
                    throw new Error('Valor de tipo incorreto para Float');
                }
                break;
            case Type_1.Category.Char:
                if (typeof data !== 'string' || data.length !== 1) {
                    throw new Error('Valor de tipo incorreto para Char');
                }
                break;
            case Type_1.Category.String:
                if (typeof data !== 'string') {
                    throw new Error('Valor de tipo incorreto para String');
                }
                break;
            case Type_1.Category.Array:
                if (!Array.isArray(data)) {
                    throw new Error('Valor de tipo incorreto para Array');
                }
                break;
            case Type_1.Category.Dict:
                if (!(typeof data === 'object' && !Array.isArray(data))) {
                    throw new Error('Valor de tipo incorreto para Dict');
                }
                break;
            default:
                throw new InternalException_1.InternalException('Unrecheable');
        }
        this.type = type;
        this.data = data;
    }
    toString() {
        return `${this.type.toString()}(${this.data})`;
    }
}
exports.Value = Value;
