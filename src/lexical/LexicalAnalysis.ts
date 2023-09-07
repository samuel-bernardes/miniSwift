import * as fs from 'fs';
import { Token } from './Token';

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
	private input: string;
	private position: number;

	constructor(filename: string) {
		this.input = fs.readFileSync(filename, 'utf8');
		this.line = 1;
		this.position = 0;
	}

	public getLine(): number {
		return this.line;
	}

	public nextToken(): Token {
		token = new Token("", Token.TokenType.END_OF_FILE, null);
		let state = 1;

		while (state !== 14 && state !== 15) {
			const c = this.getChar();

			switch (state) {
				case 1:
					if (/\s/.test(c)) {
						state = 1;
					} else if (c === '\n') {
						this.line++;
						state = 1;
					} else if (c === '/') {
						state = 2;
					} else if (/[=!<>&]/.test(c)) {
						token.lexeme += c;
						state = 5;
					} else if (c === '.' || c === ',' || c === ':' || c === ';' ||
						c === '?' || /[+\-*/(){}\[\]]/.test(c)) {
						token.lexeme += c;
						state = 14;
					} else if (/[a-zA-Z_]/.test(c)) {
						token.lexeme += c;
						state = 8;
					} else if (/[0-9]/.test(c)) {
						token.lexeme += c;
						state = 9;
					} else if (c === '\'') {
						state = 11;
					} else if (c === '\0') {
						state = 15;
					} else {
						token.lexeme += c;
						state = 15;
					}
					break;
				case 2:
					if (c === '*') {
						state = 3;
					} else {
						this.ungetChar(c);
						token.lexeme = '/';
						state = 14;
					}
					break;
				// Adicione os outros casos de estado aqui ...
			}
		}

		if (state === 14) {
			token.type = keywords[token.lexeme] ? keywords[token.lexeme] : Token.TokenType.NAME;
		}

		token.line = this.line;

		return token;
	}

	private getChar(): string {
		if (this.position < this.input.length) {
			return this.input.charAt(this.position++);
		}
		return '\0';
	}

	private ungetChar(c: string): void {
		if (this.position > 0) {
			this.position--;
		}
	}
}

const filename = 'seuarquivo.txt';
const lexer = new LexicalAnalysis(filename);

let token = lexer.nextToken();
while (token.type !== Token.TokenType.END_OF_FILE) {
	console.log(`Token: ${token.lexeme}, Type: ${Token.TokenType[token.type]}, Line: ${token.line}`);
	token = lexer.nextToken();
}
