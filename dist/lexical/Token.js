"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
class Token {
    constructor(lexeme, type, literal) {
        this.lexeme = lexeme;
        this.type = type;
        this.line = 0;
        this.literal = literal;
    }
    toString() {
        return `("${this.lexeme}", ${this.type}, ${this.line}, ${this.literal})`;
    }
}
exports.Token = Token;
(function (Token) {
    let TokenType;
    (function (TokenType) {
        TokenType[TokenType["DOT"] = 0] = "DOT";
        TokenType[TokenType["COMMA"] = 1] = "COMMA";
        TokenType[TokenType["COLON"] = 2] = "COLON";
        TokenType[TokenType["SEMICOLON"] = 3] = "SEMICOLON";
        TokenType[TokenType["OPEN_PAR"] = 4] = "OPEN_PAR";
        TokenType[TokenType["CLOSE_PAR"] = 5] = "CLOSE_PAR";
        TokenType[TokenType["OPEN_BRA"] = 6] = "OPEN_BRA";
        TokenType[TokenType["CLOSE_BRA"] = 7] = "CLOSE_BRA";
        TokenType[TokenType["OPEN_CUR"] = 8] = "OPEN_CUR";
        TokenType[TokenType["CLOSE_CUR"] = 9] = "CLOSE_CUR";
        TokenType[TokenType["ASSIGN"] = 10] = "ASSIGN";
        TokenType[TokenType["TERNARY"] = 11] = "TERNARY";
        TokenType[TokenType["AND"] = 12] = "AND";
        TokenType[TokenType["OR"] = 13] = "OR";
        TokenType[TokenType["LOWER_THAN"] = 14] = "LOWER_THAN";
        TokenType[TokenType["GREATER_THAN"] = 15] = "GREATER_THAN";
        TokenType[TokenType["LOWER_EQUAL"] = 16] = "LOWER_EQUAL";
        TokenType[TokenType["GREATER_EQUAL"] = 17] = "GREATER_EQUAL";
        TokenType[TokenType["EQUAL"] = 18] = "EQUAL";
        TokenType[TokenType["NOT_EQUAL"] = 19] = "NOT_EQUAL";
        TokenType[TokenType["ADD"] = 20] = "ADD";
        TokenType[TokenType["SUB"] = 21] = "SUB";
        TokenType[TokenType["MUL"] = 22] = "MUL";
        TokenType[TokenType["DIV"] = 23] = "DIV";
        TokenType[TokenType["NOT"] = 24] = "NOT";
        TokenType[TokenType["VAR"] = 25] = "VAR";
        TokenType[TokenType["LET"] = 26] = "LET";
        TokenType[TokenType["PRINT"] = 27] = "PRINT";
        TokenType[TokenType["PRINTLN"] = 28] = "PRINTLN";
        TokenType[TokenType["DUMP"] = 29] = "DUMP";
        TokenType[TokenType["IF"] = 30] = "IF";
        TokenType[TokenType["ELSE"] = 31] = "ELSE";
        TokenType[TokenType["WHILE"] = 32] = "WHILE";
        TokenType[TokenType["FOR"] = 33] = "FOR";
        TokenType[TokenType["IN"] = 34] = "IN";
        TokenType[TokenType["BOOL"] = 35] = "BOOL";
        TokenType[TokenType["INT"] = 36] = "INT";
        TokenType[TokenType["FLOAT"] = 37] = "FLOAT";
        TokenType[TokenType["CHAR"] = 38] = "CHAR";
        TokenType[TokenType["STRING"] = 39] = "STRING";
        TokenType[TokenType["ARRAY"] = 40] = "ARRAY";
        TokenType[TokenType["DICT"] = 41] = "DICT";
        TokenType[TokenType["FALSE"] = 42] = "FALSE";
        TokenType[TokenType["TRUE"] = 43] = "TRUE";
        TokenType[TokenType["READ"] = 44] = "READ";
        TokenType[TokenType["RANDOM"] = 45] = "RANDOM";
        TokenType[TokenType["TO_BOOL"] = 46] = "TO_BOOL";
        TokenType[TokenType["TO_INT"] = 47] = "TO_INT";
        TokenType[TokenType["TO_FLOAT"] = 48] = "TO_FLOAT";
        TokenType[TokenType["TO_CHAR"] = 49] = "TO_CHAR";
        TokenType[TokenType["TO_STRING"] = 50] = "TO_STRING";
        TokenType[TokenType["COUNT"] = 51] = "COUNT";
        TokenType[TokenType["EMPTY"] = 52] = "EMPTY";
        TokenType[TokenType["KEYS"] = 53] = "KEYS";
        TokenType[TokenType["VALUES"] = 54] = "VALUES";
        TokenType[TokenType["APPEND"] = 55] = "APPEND";
        TokenType[TokenType["CONTAINS"] = 56] = "CONTAINS";
        TokenType[TokenType["NAME"] = 57] = "NAME";
        TokenType[TokenType["INTEGER_LITERAL"] = 58] = "INTEGER_LITERAL";
        TokenType[TokenType["FLOAT_LITERAL"] = 59] = "FLOAT_LITERAL";
        TokenType[TokenType["CHAR_LITERAL"] = 60] = "CHAR_LITERAL";
        TokenType[TokenType["STRING_LITERAL"] = 61] = "STRING_LITERAL";
        TokenType[TokenType["END_OF_FILE"] = 62] = "END_OF_FILE";
        TokenType[TokenType["INVALID_TOKEN"] = 63] = "INVALID_TOKEN";
        TokenType[TokenType["UNEXPECTED_EOF"] = 64] = "UNEXPECTED_EOF";
    })(TokenType = Token.TokenType || (Token.TokenType = {}));
})(Token || (exports.Token = Token = {}));
