"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customErrors = exports.LanguageException = void 0;
class LanguageException extends Error {
    constructor(line, msg) {
        super(`${line.toString().padStart(2, '0')}: ${msg}`);
        this.line = line;
        this.name = 'LanguageException';
    }
    getLine() {
        return this.line;
    }
    static instance(line, error, ...args) {
        if (error.args !== args.length) {
            throw new Error('Número incorreto de argumentos fornecidos para a exceção.');
        }
        const msg = error.args === 0 ? error.msg : `${error.msg} ${args.join(', ')}`;
        return new LanguageException(line, msg);
    }
}
exports.LanguageException = LanguageException;
const customErrors = {
    InvalidLexeme: { msg: 'Lexema inválido [%s]', args: 1 },
    UnexpectedEOF: { msg: 'Fim de arquivo inesperado', args: 0 },
    UnexpectedLexeme: { msg: 'Lexema não esperado [%s]', args: 1 },
    UndeclaredVariable: { msg: 'Variável não declarada [%s]', args: 1 },
    AlreadyDeclaredVariable: { msg: 'Variável já declarada anteriormente [%s]', args: 1 },
    UninitializedVariable: { msg: 'Variável não inicializada [%s]', args: 1 },
    ConstantAssignment: { msg: 'Atribuição em variável constante [%s]', args: 1 },
    InvalidType: { msg: 'Tipo inválido [%s]', args: 1 },
    InvalidOperation: { msg: 'Operação inválida', args: 0 },
};
exports.customErrors = customErrors;
