"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalException = void 0;
class InternalException extends Error {
    constructor(message) {
        super(message);
        this.name = 'InternalException';
    }
}
exports.InternalException = InternalException;
