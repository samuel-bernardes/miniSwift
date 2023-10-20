"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaticException = void 0;
class SyntaticException extends Error {
    constructor(line, reason) {
        super(`${line}: ${reason}`);
    }
}
exports.SyntaticException = SyntaticException;
