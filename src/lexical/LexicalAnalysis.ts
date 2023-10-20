import * as fs from 'fs';
import { Token } from './Token';
import { InternalException } from '../error/InternalException';
import { Value } from '../interpreter/value/Value';
import { PrimitiveTypes } from '../interpreter/type/primitive/types';

const keywords: { [key: string]: Token.TokenType } = {
	'.': Token.TokenType.DOT,
	',': Token.TokenType.COMMA,
	':': Token.TokenType.COLON,
	';': Token.TokenType.SEMICOLON,
	'(': Token.TokenType.OPEN_PAR,
	')': Token.TokenType.CLOSE_PAR,
	'[': Token.TokenType.OPEN_BRA,
	']': Token.TokenType.CLOSE_BRA,
	'{': Token.TokenType.OPEN_CUR,
	'}': Token.TokenType.CLOSE_CUR,
	'=': Token.TokenType.ASSIGN,
	'?': Token.TokenType.TERNARY,
	'&&': Token.TokenType.AND,
	'||': Token.TokenType.OR,
	'<': Token.TokenType.LOWER_THAN,
	'>': Token.TokenType.GREATER_THAN,
	'<=': Token.TokenType.LOWER_EQUAL,
	'>=': Token.TokenType.GREATER_EQUAL,
	'==': Token.TokenType.EQUAL,
	'!=': Token.TokenType.NOT_EQUAL,
	'+': Token.TokenType.ADD,
	'-': Token.TokenType.SUB,
	'*': Token.TokenType.MUL,
	'/': Token.TokenType.DIV,
	'!': Token.TokenType.NOT,
	'var': Token.TokenType.VAR,
	'let': Token.TokenType.LET,
	'print': Token.TokenType.PRINT,
	'println': Token.TokenType.PRINTLN,
	'dump': Token.TokenType.DUMP,
	'if': Token.TokenType.IF,
	'else': Token.TokenType.ELSE,
	'while': Token.TokenType.WHILE,
	'for': Token.TokenType.FOR,
	'in': Token.TokenType.IN,
	'Bool': Token.TokenType.BOOL,
	'Int': Token.TokenType.INT,
	'Float': Token.TokenType.FLOAT,
	'Char': Token.TokenType.CHAR,
	'String': Token.TokenType.STRING,
	'Array': Token.TokenType.ARRAY,
	'Dict': Token.TokenType.DICT,
	'false': Token.TokenType.FALSE,
	'true': Token.TokenType.TRUE,
	'read': Token.TokenType.READ,
	'random': Token.TokenType.RANDOM,
	'toBool': Token.TokenType.TO_BOOL,
	'toInt': Token.TokenType.TO_INT,
	'toFloat': Token.TokenType.TO_FLOAT,
	'toChar': Token.TokenType.TO_CHAR,
	'toString': Token.TokenType.TO_STRING,
	'count': Token.TokenType.COUNT,
	'empty': Token.TokenType.EMPTY,
	'keys': Token.TokenType.KEYS,
	'values': Token.TokenType.VALUES,
	'append': Token.TokenType.APPEND,
	'contains': Token.TokenType.CONTAINS,
};
export class LexicalAnalysis {
	private line: number;
	private input: string[];
	private position: number;

	constructor(filename: string) {
		this.input = fs.readFileSync(filename, 'utf8').split('');
		this.line = 1;
		this.position = 0;
	}

	public nextToken(): Token {
		let token = new Token("", Token.TokenType.END_OF_FILE, null);
		let state = 1;

		while (state !== 14 && state !== 15) {
			const c = this.getChar();
			this.position++;

			switch (state) {
				case 1:
					if (c == ' ' || c == '\r' || c == '\t') {
						state = 1;
					} else if (c == '\n') {
						this.line++;
						state = 1;
					} else if (c == '/') {
						state = 2;
					} else if (/[=!<>]/.test(c)) {
						token.lexeme += c;
						state = 5;
					} else if (c == '&') {
						token.lexeme += c;
						state = 6;
					} else if (c == "|") {
						token.lexeme += c;
						state = 7;
					} else if (c == ',' || c == ':' || c == ';' ||
						c == '?' || /[+\-*(){}[\].]/.test(c)) {
						token.lexeme += c;
						state = 14;
					} else if (c == '_' || this.isLetter(c)) {
						token.lexeme += c;
						state = 8;
					} else if (this.isNumber(c)) {
						token.lexeme += c;
						state = 9;
					} else if (c == '\'') {
						state = 11;
					} else if (c == `"`) {
						state = 13;
					} else if (c == '\0') {
						token.type = Token.TokenType.END_OF_FILE;
						state = 15;
					} else {
						token.lexeme += c;
						token.type = Token.TokenType.INVALID_TOKEN;
						state = 15;
					}

					break;

				case 2:
					if (c == '\0') {
						token.type = Token.TokenType.UNEXPECTED_EOF;
						state = 15;
					} else if (c == '*') {
						state = 3;
					} else {
						this.ungetChar();
						token.lexeme = '/';
						state = 14;
					}
					break;
				case 3:
					if (c == '\0') {
						token.type = Token.TokenType.UNEXPECTED_EOF;
						state = 15;
					} else if (c == "*") {
						state = 4;
					} else {
						state = 3;
					}
					break
				case 4:
					if (c == '\0') {
						token.type = Token.TokenType.UNEXPECTED_EOF;
						state = 15;
					} else if (c == "*") {
						state = 4;
					} else if (c == "/") {
						state = 1;
					}
					break;
				case 5:
					if (c == '\0') {
						token.type = Token.TokenType.UNEXPECTED_EOF;
						state = 15;
					} else if (c == '=') {
						token.lexeme += c;
						state = 14;
					} else {
						this.ungetChar();
						state = 14;
					}

					break;
				case 6:
					if (c == '\0') {
						token.type = Token.TokenType.UNEXPECTED_EOF;
						state = 15;
					} else if (c == '&') {
						token.lexeme += c;
						state = 14;
					} else {
						this.ungetChar();
						token.type = Token.TokenType.INVALID_TOKEN;
						state = 15;
					}

					break;
				case 7:
					if (c == '\0') {
						token.type = Token.TokenType.UNEXPECTED_EOF;
						state = 15;
					} else if (c == '|') {
						token.lexeme += c;
						state = 14;
					} else {
						this.ungetChar();
						token.type = Token.TokenType.INVALID_TOKEN;
						state = 15;
					}
					break;
				case 8:
					if (c == '_' || this.isLetter(c) || this.isNumber(c)) {
						token.lexeme += c;
						state = 8;
					} else {
						this.ungetChar();
						state = 14;
					}
					break;
				case 9:
					if (c == '\0') {
						token.type = Token.TokenType.UNEXPECTED_EOF;
						state = 15;
					} if (this.isNumber(c)) {
						token.lexeme += c;
						state = 9;
					} else if (c == '.') {
						token.lexeme += c;
						state = 10;
					} else {
						this.ungetChar();
						token.type = Token.TokenType.INTEGER_LITERAL;
						token.literal = new Value(PrimitiveTypes.IntType.instance(), Number(token.lexeme));
						state = 15;
					}

					break;
				case 10:
					if (this.isNumber(c)) {
						token.lexeme += c;
						state = 10;
					} else {
						this.ungetChar();
						token.type = Token.TokenType.FLOAT;
						token.literal = new Value(PrimitiveTypes.FloatType.instance(), Number(token.lexeme));
						state = 15;
					}
					break;

				case 11:
					if (c == '\0') {
						token.type = Token.TokenType.UNEXPECTED_EOF;
						state = 15;
					} else if (c != '\'') {
						if (c == '\n') {
							this.line++;
						}
						token.lexeme += c;
						state = 12;
					} else {
						token.type = Token.TokenType.INVALID_TOKEN;
						state = 15;
					}
					break;
				case 12:
					if (c == '\0') {
						token.type = Token.TokenType.UNEXPECTED_EOF;
						state = 15;
					} else if (c == '\'') {
						token.literal = new Value(PrimitiveTypes.CharType.instance(), token.lexeme.charAt(0));
						token.type = Token.TokenType.CHAR_LITERAL;
						state = 15;
					} else {
						token.type = Token.TokenType.INVALID_TOKEN;
						state = 15;
					}

					break;
				case 13:
					if (c == `"`) {
						token.literal = new Value(PrimitiveTypes.StringType.instance(), token.lexeme);
						token.type = Token.TokenType.STRING_LITERAL;
						state = 15;
					} else {
						token.lexeme += c;
						state = 13;
					}
					break;
				default:
					throw new InternalException("Unreachable");
			}
		}

		if (state === 14) {
			token.type = keywords[token.lexeme] !== undefined ? keywords[token.lexeme] : Token.TokenType.NAME;
		}

		token.line = this.line;

		return token;
	}

	private getChar(): string {
		if (this.position < this.input.length) {
			return this.input[this.position];
		}
		return '\0';
	}

	private isNumber(char: string) {
		return /^[0-9]$/.test(char);
	}

	private isLetter(char: string) {
		return /^[a-zA-Z]$/.test(char);
	}

	private ungetChar(): void {
		if (this.position > 0) {
			this.position--;
		}
	}
}