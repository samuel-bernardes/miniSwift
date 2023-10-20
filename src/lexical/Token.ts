import { Value } from '../interpreter/value/Value'; // Substitua './interpreter' pelo caminho correto do seu módulo de interpretação

export class Token {
    public lexeme: string;
    public type: Token.TokenType;
    public line: number;
    public literal: Value | null;

    constructor(lexeme: string, type: Token.TokenType, literal: Value | null) {
        this.lexeme = lexeme;
        this.type = type;
        this.line = 0;
        this.literal = literal;
    }

    public toString(): string {
        return `("${this.lexeme}", ${this.type}, ${this.line}, ${this.literal})`;
    }
}

export namespace Token {
    export enum TokenType {
        DOT,
        COMMA,
        COLON,
        SEMICOLON,
        OPEN_PAR,
        CLOSE_PAR,
        OPEN_BRA,
        CLOSE_BRA,
        OPEN_CUR,
        CLOSE_CUR,
        ASSIGN,
        TERNARY,
        AND,
        OR,
        LOWER_THAN,
        GREATER_THAN,
        LOWER_EQUAL,
        GREATER_EQUAL,
        EQUAL,
        NOT_EQUAL,
        ADD,
        SUB,
        MUL,
        DIV,
        NOT,
        VAR,
        LET,
        PRINT,
        PRINTLN,
        DUMP,
        IF,
        ELSE,
        WHILE,
        FOR,
        IN,
        BOOL,
        INT,
        FLOAT,
        CHAR,
        STRING,
        ARRAY,
        DICT,
        FALSE,
        TRUE,
        READ,
        RANDOM,
        TO_BOOL,
        TO_INT,
        TO_FLOAT,
        TO_CHAR,
        TO_STRING,
        COUNT,
        EMPTY,
        KEYS,
        VALUES,
        APPEND,
        CONTAINS,
        NAME,
        INTEGER_LITERAL,
        FLOAT_LITERAL,
        CHAR_LITERAL,
        STRING_LITERAL,    
        END_OF_FILE,
        INVALID_TOKEN,
        UNEXPECTED_EOF,
    }
}
