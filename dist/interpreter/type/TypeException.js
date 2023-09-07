"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeException = void 0;
class TypeException extends Error {
    constructor() {
        super('Tipo inválido');
    }
}
exports.TypeException = TypeException;
