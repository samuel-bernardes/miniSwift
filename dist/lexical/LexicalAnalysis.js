"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LexicalAnalysis = void 0;
const Token_1 = require("./Token");
const InternalException_1 = require("../error/InternalException");
const Value_1 = require("../interpreter/value/Value");
const types_1 = require("../interpreter/type/primitive/types");
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
    constructor(input) {
        this.input = input;
        this.line = 1;
        this.position = 0;
    }
    nextToken() {
        let token = new Token_1.Token("", Token_1.Token.TokenType.END_OF_FILE, null);
        let state = 1;
        while (state !== 14 && state !== 15) {
            const c = this.getChar();
            this.position++;
            switch (state) {
                case 1:
                    if (c == ' ' || c == '\r' || c == '\t') {
                        state = 1;
                    }
                    else if (c == '\n') {
                        this.line++;
                        state = 1;
                    }
                    else if (c == '/') {
                        state = 2;
                    }
                    else if (/[=!<>]/.test(c)) {
                        token.lexeme += c;
                        state = 5;
                    }
                    else if (c == '&') {
                        token.lexeme += c;
                        state = 6;
                    }
                    else if (c == "|") {
                        token.lexeme += c;
                        state = 7;
                    }
                    else if (c == ',' || c == ':' || c == ';' ||
                        c == '?' || /[+\-*(){}[\].]/.test(c)) {
                        token.lexeme += c;
                        state = 14;
                    }
                    else if (c == '_' || this.isLetter(c)) {
                        token.lexeme += c;
                        state = 8;
                    }
                    else if (this.isNumber(c)) {
                        token.lexeme += c;
                        state = 9;
                    }
                    else if (c == '\'') {
                        state = 11;
                    }
                    else if (c == `"`) {
                        state = 13;
                    }
                    else if (c == '\0') {
                        token.type = Token_1.Token.TokenType.END_OF_FILE;
                        state = 15;
                    }
                    else {
                        token.lexeme += c;
                        token.type = Token_1.Token.TokenType.INVALID_TOKEN;
                        state = 15;
                    }
                    break;
                case 2:
                    if (c == '\0') {
                        token.type = Token_1.Token.TokenType.UNEXPECTED_EOF;
                        state = 15;
                    }
                    else if (c == '*') {
                        state = 3;
                    }
                    else {
                        this.ungetChar();
                        token.lexeme = '/';
                        state = 14;
                    }
                    break;
                case 3:
                    if (c == '\0') {
                        token.type = Token_1.Token.TokenType.UNEXPECTED_EOF;
                        state = 15;
                    }
                    else if (c == "*") {
                        state = 4;
                    }
                    else {
                        state = 3;
                    }
                    break;
                case 4:
                    if (c == '\0') {
                        token.type = Token_1.Token.TokenType.UNEXPECTED_EOF;
                        state = 15;
                    }
                    else if (c == "*") {
                        state = 4;
                    }
                    else if (c == "/") {
                        state = 1;
                    }
                    break;
                case 5:
                    if (c == '\0') {
                        token.type = Token_1.Token.TokenType.UNEXPECTED_EOF;
                        state = 15;
                    }
                    else if (c == '=') {
                        token.lexeme += c;
                        state = 14;
                    }
                    else {
                        this.ungetChar();
                        state = 14;
                    }
                    break;
                case 6:
                    if (c == '\0') {
                        token.type = Token_1.Token.TokenType.UNEXPECTED_EOF;
                        state = 15;
                    }
                    else if (c == '&') {
                        token.lexeme += c;
                        state = 14;
                    }
                    else {
                        this.ungetChar();
                        token.type = Token_1.Token.TokenType.INVALID_TOKEN;
                        state = 15;
                    }
                    break;
                case 7:
                    if (c == '\0') {
                        token.type = Token_1.Token.TokenType.UNEXPECTED_EOF;
                        state = 15;
                    }
                    else if (c == '|') {
                        token.lexeme += c;
                        state = 14;
                    }
                    else {
                        this.ungetChar();
                        token.type = Token_1.Token.TokenType.INVALID_TOKEN;
                        state = 15;
                    }
                    break;
                case 8:
                    if (c == '_' || this.isLetter(c) || this.isNumber(c)) {
                        token.lexeme += c;
                        state = 8;
                    }
                    else {
                        this.ungetChar();
                        state = 14;
                    }
                    break;
                case 9:
                    if (c == '\0') {
                        token.type = Token_1.Token.TokenType.UNEXPECTED_EOF;
                        state = 15;
                    }
                    if (this.isNumber(c)) {
                        token.lexeme += c;
                        state = 9;
                    }
                    else if (c == '.') {
                        token.lexeme += c;
                        state = 10;
                    }
                    else {
                        this.ungetChar();
                        token.type = Token_1.Token.TokenType.INTEGER_LITERAL;
                        token.literal = new Value_1.Value(types_1.PrimitiveTypes.IntType.instance(), Number(token.lexeme));
                        state = 15;
                    }
                    break;
                case 10:
                    if (this.isNumber(c)) {
                        token.lexeme += c;
                        state = 10;
                    }
                    else {
                        this.ungetChar();
                        token.type = Token_1.Token.TokenType.FLOAT;
                        token.literal = new Value_1.Value(types_1.PrimitiveTypes.FloatType.instance(), Number(token.lexeme));
                        state = 15;
                    }
                    break;
                case 11:
                    if (c == '\0') {
                        token.type = Token_1.Token.TokenType.UNEXPECTED_EOF;
                        state = 15;
                    }
                    else if (c != '\'') {
                        if (c == '\n') {
                            this.line++;
                        }
                        token.lexeme += c;
                        state = 12;
                    }
                    else {
                        token.type = Token_1.Token.TokenType.INVALID_TOKEN;
                        state = 15;
                    }
                    break;
                case 12:
                    if (c == '\0') {
                        token.type = Token_1.Token.TokenType.UNEXPECTED_EOF;
                        state = 15;
                    }
                    else if (c == '\'') {
                        token.literal = new Value_1.Value(types_1.PrimitiveTypes.CharType.instance(), token.lexeme.charAt(0));
                        token.type = Token_1.Token.TokenType.CHAR_LITERAL;
                        state = 15;
                    }
                    else {
                        token.type = Token_1.Token.TokenType.INVALID_TOKEN;
                        state = 15;
                    }
                    break;
                case 13:
                    if (c == `"`) {
                        token.literal = new Value_1.Value(types_1.PrimitiveTypes.StringType.instance(), token.lexeme);
                        token.type = Token_1.Token.TokenType.STRING_LITERAL;
                        state = 15;
                    }
                    else {
                        token.lexeme += c;
                        state = 13;
                    }
                    break;
                default:
                    throw new InternalException_1.InternalException("Unreachable");
            }
        }
        if (state === 14) {
            token.type = keywords[token.lexeme] !== undefined ? keywords[token.lexeme] : Token_1.Token.TokenType.NAME;
        }
        token.line = this.line;
        return token;
    }
    getChar() {
        if (this.position < this.input.length) {
            return this.input[this.position];
        }
        return '\0';
    }
    isNumber(char) {
        return /^[0-9]$/.test(char);
    }
    isLetter(char) {
        return /^[a-zA-Z]$/.test(char);
    }
    ungetChar() {
        if (this.position > 0) {
            this.position--;
        }
    }
}
exports.LexicalAnalysis = LexicalAnalysis;
