interface CustomError {
    msg: string;
    args: number;
}

export class LanguageException extends Error {
    private line: number;

    constructor(line: number, msg: string) {
        super(`${line.toString().padStart(2, '0')}: ${msg}`);
        this.line = line;
        this.name = 'LanguageException';
    }

    public getLine(): number {
        return this.line;
    }

    public static instance(line: number, error: CustomError, ...args: string[]): LanguageException {
        if (error.args !== args.length) {
            throw new Error('Número incorreto de argumentos fornecidos para a exceção.');
        }

        const msg = error.args === 0 ? error.msg : `${error.msg} [${args[0]}]`;
        throw new LanguageException(line, msg);
    }
}

const customErrors: { [key: string]: CustomError } = {
    InvalidLexeme: { msg: `Lexema inválido`, args: 1 },
    UnexpectedEOF: { msg: 'Fim de arquivo inesperado', args: 0 },
    UnexpectedLexeme: { msg: 'Lexema não esperado', args: 1 },
    UndeclaredVariable: { msg: 'Variável não declarada', args: 1 },
    AlreadyDeclaredVariable: { msg: 'Variável já declarada anteriormente', args: 1 },
    UninitializedVariable: { msg: 'Variável não inicializada', args: 1 },
    ConstantAssignment: { msg: 'Atribuição em variável constante', args: 1 },
    InvalidType: { msg: 'Tipo inválido', args: 1 },
    InvalidOperation: { msg: 'Operação inválida', args: 0 },
    InvalidValue: { msg: 'Valor inesperado! ', args: 0 },
};

export { customErrors };
