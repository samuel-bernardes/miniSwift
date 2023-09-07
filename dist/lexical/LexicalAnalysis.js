"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LexicalAnalysis = void 0;
const fs = __importStar(require("fs"));
const Token_1 = require("./Token");
const keywords = {
    '.': Token_1.Token.TokenType.DOT,
    ',': Token_1.Token.TokenType.COMMA,
    ':': Token_1.Token.TokenType.COLON,
    ';': Token_1.Token.TokenType.SEMICOLON,
    '(': Token_1.Token.TokenType.OPEN_PAR,
    ')': Token_1.Token.TokenType.CLOSE_PAR,
    '[': Token_1.Token.TokenType.OPEN_BRA,
    ']': Token_1.Token.TokenType.CLOSE_BRA,
    '{': Token_1.Token.TokenType.OPEN_CUR,
    '}': Token_1.Token.TokenType.CLOSE_CUR,
    '=': Token_1.Token.TokenType.ASSIGN,
    '?': Token_1.Token.TokenType.TERNARY,
    '&&': Token_1.Token.TokenType.AND,
    '||': Token_1.Token.TokenType.OR,
    '<': Token_1.Token.TokenType.LOWER_THAN,
    '>': Token_1.Token.TokenType.GREATER_THAN,
    '<=': Token_1.Token.TokenType.LOWER_EQUAL,
    '>=': Token_1.Token.TokenType.GREATER_EQUAL,
    '==': Token_1.Token.TokenType.EQUAL,
    '!=': Token_1.Token.TokenType.NOT_EQUAL,
    '+': Token_1.Token.TokenType.ADD,
    '-': Token_1.Token.TokenType.SUB,
    '*': Token_1.Token.TokenType.MUL,
    '/': Token_1.Token.TokenType.DIV,
    '!': Token_1.Token.TokenType.NOT,
    'var': Token_1.Token.TokenType.VAR,
    'let': Token_1.Token.TokenType.LET,
    'print': Token_1.Token.TokenType.PRINT,
    'println': Token_1.Token.TokenType.PRINTLN,
    'dump': Token_1.Token.TokenType.DUMP,
    'if': Token_1.Token.TokenType.IF,
    'else': Token_1.Token.TokenType.ELSE,
    'while': Token_1.Token.TokenType.WHILE,
    'for': Token_1.Token.TokenType.FOR,
    'in': Token_1.Token.TokenType.IN,
    'Bool': Token_1.Token.TokenType.BOOL,
    'Int': Token_1.Token.TokenType.INT,
    'Float': Token_1.Token.TokenType.FLOAT,
    'Char': Token_1.Token.TokenType.CHAR,
    'String': Token_1.Token.TokenType.STRING,
    'Array': Token_1.Token.TokenType.ARRAY,
    'Dict': Token_1.Token.TokenType.DICT,
    'false': Token_1.Token.TokenType.FALSE,
    'true': Token_1.Token.TokenType.TRUE,
    'read': Token_1.Token.TokenType.READ,
    'random': Token_1.Token.TokenType.RANDOM,
    'toBool': Token_1.Token.TokenType.TO_BOOL,
    'toInt': Token_1.Token.TokenType.TO_INT,
    'toFloat': Token_1.Token.TokenType.TO_FLOAT,
    'toChar': Token_1.Token.TokenType.TO_CHAR,
    'toString': Token_1.Token.TokenType.TO_STRING,
    'count': Token_1.Token.TokenType.COUNT,
    'empty': Token_1.Token.TokenType.EMPTY,
    'keys': Token_1.Token.TokenType.KEYS,
    'values': Token_1.Token.TokenType.VALUES,
    'append': Token_1.Token.TokenType.APPEND,
    'contains': Token_1.Token.TokenType.CONTAINS,
};
class LexicalAnalysis {
    constructor(filename) {
        this.input = fs.readFileSync(filename, 'utf8');
        this.line = 1;
        this.position = 0;
    }
    getLine() {
        return this.line;
    }
    nextToken() {
        token = new Token_1.Token("", Token_1.Token.TokenType.END_OF_FILE, null);
        let state = 1;
        while (state !== 14 && state !== 15) {
            const c = this.getChar();
            switch (state) {
                case 1:
                    if (/\s/.test(c)) {
                        state = 1;
                    }
                    else if (c === '\n') {
                        this.line++;
                        state = 1;
                    }
                    else if (c === '/') {
                        state = 2;
                    }
                    else if (/[=!<>&]/.test(c)) {
                        token.lexeme += c;
                        state = 5;
                    }
                    else if (c === '.' || c === ',' || c === ':' || c === ';' ||
                        c === '?' || /[+\-*/(){}\[\]]/.test(c)) {
                        token.lexeme += c;
                        state = 14;
                    }
                    else if (/[a-zA-Z_]/.test(c)) {
                        token.lexeme += c;
                        state = 8;
                    }
                    else if (/[0-9]/.test(c)) {
                        token.lexeme += c;
                        state = 9;
                    }
                    else if (c === '\'') {
                        state = 11;
                    }
                    else if (c === '\0') {
                        state = 15;
                    }
                    else {
                        token.lexeme += c;
                        state = 15;
                    }
                    break;
                case 2:
                    if (c === '*') {
                        state = 3;
                    }
                    else {
                        this.ungetChar(c);
                        token.lexeme = '/';
                        state = 14;
                    }
                    break;
                // Adicione os outros casos de estado aqui ...
            }
        }
        if (state === 14) {
            token.type = keywords[token.lexeme] ? keywords[token.lexeme] : Token_1.Token.TokenType.NAME;
        }
        token.line = this.line;
        return token;
    }
    getChar() {
        if (this.position < this.input.length) {
            return this.input.charAt(this.position++);
        }
        return '\0';
    }
    ungetChar(c) {
        if (this.position > 0) {
            this.position--;
        }
    }
}
exports.LexicalAnalysis = LexicalAnalysis;
const filename = 'seuarquivo.txt';
const lexer = new LexicalAnalysis(filename);
let token = lexer.nextToken();
while (token.type !== Token_1.Token.TokenType.END_OF_FILE) {
    console.log(`Token: ${token.lexeme}, Type: ${Token_1.Token.TokenType[token.type]}, Line: ${token.line}`);
    token = lexer.nextToken();
}
