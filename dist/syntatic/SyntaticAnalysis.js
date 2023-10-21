"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaticAnalysis = void 0;
const LanguageException_1 = require("../error/LanguageException");
const Environment_1 = require("../interpreter/Environment");
const Interpreter_1 = require("../interpreter/Interpreter");
const AssingCommand_1 = require("../interpreter/command/AssingCommand");
const BlocksCommand_1 = require("../interpreter/command/BlocksCommand");
const DumpCommand_1 = require("../interpreter/command/DumpCommand");
const PrintCommand_1 = require("../interpreter/command/PrintCommand");
const ConstExpr_1 = require("../interpreter/expr/ConstExpr");
const SetExpr_1 = require("../interpreter/expr/SetExpr");
const UnaryExpr_1 = require("../interpreter/expr/UnaryExpr");
const BoolType_1 = require("../interpreter/type/primitive/types/BoolType");
const CharType_1 = require("../interpreter/type/primitive/types/CharType");
const FloatType_1 = require("../interpreter/type/primitive/types/FloatType");
const IntType_1 = require("../interpreter/type/primitive/types/IntType");
const StringType_1 = require("../interpreter/type/primitive/types/StringType");
const Value_1 = require("../interpreter/value/Value");
const Token_1 = require("../lexical/Token");
class SyntaticAnalysis {
    constructor(lex) {
        this.lex = lex;
        this.current = lex.nextToken();
        this.previous = null;
        this.environment = Interpreter_1.Interpreter.globals;
    }
    process() {
        let cmd = this.procCode();
        this.eat(Token_1.Token.TokenType.END_OF_FILE);
        return cmd;
    }
    advance() {
        console.log("Found " + this.current);
        this.previous = this.current;
        this.current = this.lex.nextToken();
    }
    eat(type) {
        if (type == this.current.type) {
            this.advance();
        }
        else {
            console.log(`Expected (${type}), found ` + this.current);
            this.reportError();
        }
    }
    check(types) {
        let found = false;
        types.forEach(type => {
            if (this.current.type == type) {
                found = true;
            }
        });
        return found;
    }
    match(types) {
        if (this.check(types)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    }
    reportError() {
        let line = this.current.line;
        switch (this.current.type) {
            case Token_1.Token.TokenType.INVALID_TOKEN:
                throw LanguageException_1.LanguageException.instance(line, LanguageException_1.customErrors.InvalidLexeme, this.current.lexeme);
            case Token_1.Token.TokenType.UNEXPECTED_EOF:
            case Token_1.Token.TokenType.END_OF_FILE:
                throw LanguageException_1.LanguageException.instance(line, LanguageException_1.customErrors.UnexpectedEOF);
            default:
                throw LanguageException_1.LanguageException.instance(line, LanguageException_1.customErrors.UnexpectedLexeme, this.current.lexeme);
        }
    }
    // <code> ::= { <cmd> }
    procCode() {
        let line = this.current.line;
        let cmd;
        let cmds = []; // Inicialize cmds como um array vazio
        while (this.check([Token_1.Token.TokenType.OPEN_CUR,
            Token_1.Token.TokenType.VAR, Token_1.Token.TokenType.LET,
            Token_1.Token.TokenType.PRINT, Token_1.Token.TokenType.PRINTLN,
            Token_1.Token.TokenType.DUMP, Token_1.Token.TokenType.IF,
            Token_1.Token.TokenType.WHILE, Token_1.Token.TokenType.FOR,
            Token_1.Token.TokenType.NOT, Token_1.Token.TokenType.SUB,
            Token_1.Token.TokenType.OPEN_PAR, Token_1.Token.TokenType.FALSE,
            Token_1.Token.TokenType.TRUE, Token_1.Token.TokenType.INTEGER_LITERAL,
            Token_1.Token.TokenType.FLOAT_LITERAL, Token_1.Token.TokenType.CHAR_LITERAL,
            Token_1.Token.TokenType.STRING_LITERAL, Token_1.Token.TokenType.READ,
            Token_1.Token.TokenType.RANDOM, Token_1.Token.TokenType.TO_BOOL,
            Token_1.Token.TokenType.TO_INT, Token_1.Token.TokenType.TO_FLOAT,
            Token_1.Token.TokenType.TO_CHAR, Token_1.Token.TokenType.TO_STRING,
            Token_1.Token.TokenType.ARRAY, Token_1.Token.TokenType.DICT, Token_1.Token.TokenType.NAME])) {
            cmd = this.procCmd();
            if (cmd != null)
                cmds.push(cmd);
        }
        let bcmd = new BlocksCommand_1.BlocksCommand(line, cmds);
        return bcmd;
    }
    // <block> ::= '{' <code> '}'
    procBlock() {
        this.eat(Token_1.Token.TokenType.OPEN_CUR);
        let old = this.environment;
        this.environment = new Environment_1.Environment(old);
        let bcmd;
        try {
            bcmd = this.procCode();
            ;
            this.eat(Token_1.Token.TokenType.CLOSE_CUR);
        }
        finally {
            this.environment = old;
        }
        return bcmd;
    }
    // <decl> ::= <var> | <let>
    procDecl() {
        if (this.check([Token_1.Token.TokenType.VAR])) {
            this.procVar();
        }
        else if (this.check([Token_1.Token.TokenType.LET])) {
            this.procLet();
        }
        else {
            this.reportError();
        }
    }
    // <cmd> ::= <block> | <decl> | <print> | <dump> | <if> | <while> | <for> | <assign>
    procCmd() {
        let cmd = null; // Inicialize com null
        if (this.check([Token_1.Token.TokenType.OPEN_CUR])) {
            cmd = this.procBlock();
        }
        else if (this.check([Token_1.Token.TokenType.VAR, Token_1.Token.TokenType.LET])) {
            this.procDecl();
        }
        else if (this.check([Token_1.Token.TokenType.PRINT, Token_1.Token.TokenType.PRINTLN])) {
            cmd = this.procPrint();
        }
        else if (this.check([Token_1.Token.TokenType.DUMP])) {
            cmd = this.procDump();
        }
        else if (this.check([Token_1.Token.TokenType.IF])) {
            this.procIf();
        }
        else if (this.check([Token_1.Token.TokenType.WHILE])) {
            this.procWhile();
        }
        else if (this.check([Token_1.Token.TokenType.FOR])) {
            this.procFor();
        }
        else if (this.check([Token_1.Token.TokenType.NOT, Token_1.Token.TokenType.SUB,
            Token_1.Token.TokenType.OPEN_PAR, Token_1.Token.TokenType.FALSE,
            Token_1.Token.TokenType.TRUE, Token_1.Token.TokenType.INTEGER_LITERAL,
            Token_1.Token.TokenType.FLOAT_LITERAL, Token_1.Token.TokenType.CHAR_LITERAL,
            Token_1.Token.TokenType.STRING_LITERAL, Token_1.Token.TokenType.READ,
            Token_1.Token.TokenType.RANDOM, Token_1.Token.TokenType.TO_BOOL,
            Token_1.Token.TokenType.TO_INT, Token_1.Token.TokenType.TO_FLOAT,
            Token_1.Token.TokenType.TO_CHAR, Token_1.Token.TokenType.TO_STRING,
            Token_1.Token.TokenType.ARRAY, Token_1.Token.TokenType.DICT, Token_1.Token.TokenType.NAME])) {
            cmd = this.procAssign();
        }
        else {
            this.reportError();
        }
        /* if (cmd === null) {
            throw LanguageException.instance(this.current.line, customErrors["InvalidOperation"]);
        } */
        return cmd;
    }
    // <var> ::= var <name> ':' <type> [ '=' <expr> ] { ',' <name> ':' <type> [ '=' <expr> ] } [';']
    procVar() {
        this.eat(Token_1.Token.TokenType.VAR);
        let name = this.procName();
        this.eat(Token_1.Token.TokenType.COLON);
        let type = this.procType();
        let v = this.environment.declare(name, type, false);
        if (this.match([Token_1.Token.TokenType.ASSIGN])) {
            this.procExpr();
        }
        while (this.match([Token_1.Token.TokenType.COMMA])) {
            this.procName();
            this.eat(Token_1.Token.TokenType.COLON);
            this.procType();
            if (this.match([Token_1.Token.TokenType.ASSIGN])) {
                this.procExpr();
            }
        }
        this.match([Token_1.Token.TokenType.SEMICOLON]);
    }
    // <let> ::= let <name> ':' <type> '=' <expr> { ',' <name> ':' <type> '=' <expr> } [';']
    procLet() {
        this.eat(Token_1.Token.TokenType.LET);
        this.procName();
        this.eat(Token_1.Token.TokenType.COLON);
        this.procType();
        this.eat(Token_1.Token.TokenType.ASSIGN);
        this.procExpr();
        while (this.match([Token_1.Token.TokenType.COMMA])) {
            this.procName();
            this.eat(Token_1.Token.TokenType.COLON);
            this.procType();
            if (this.match([Token_1.Token.TokenType.ASSIGN])) {
                this.procExpr();
            }
        }
        this.match([Token_1.Token.TokenType.SEMICOLON]);
    }
    // <print> ::= (print | println) '(' <expr> ')' [';']
    procPrint() {
        let newLine = false;
        if (this.match([Token_1.Token.TokenType.PRINT, Token_1.Token.TokenType.PRINTLN])) {
            if (this.previous) {
                newLine = (this.previous.type == Token_1.Token.TokenType.PRINTLN);
            }
        }
        else {
            this.reportError();
        }
        let line = -1;
        if (this.previous)
            line = this.previous.line;
        this.eat(Token_1.Token.TokenType.OPEN_PAR);
        let expr = this.procExpr();
        this.eat(Token_1.Token.TokenType.CLOSE_PAR);
        this.match([Token_1.Token.TokenType.SEMICOLON]);
        let pcmd = new PrintCommand_1.PrintCommand(line, expr, newLine);
        return pcmd;
    }
    // <dump> ::= dump '(' <expr> ')' [';']
    procDump() {
        this.eat(Token_1.Token.TokenType.DUMP);
        let line = -1;
        if (this.previous)
            line = this.previous.line;
        this.eat(Token_1.Token.TokenType.OPEN_PAR);
        let expr = this.procExpr();
        this.eat(Token_1.Token.TokenType.CLOSE_PAR);
        this.match([Token_1.Token.TokenType.SEMICOLON]);
        let dcmd = new DumpCommand_1.DumpCommand(line, expr);
        return dcmd;
    }
    // <if> ::= if <expr> <cmd> [ else <cmd> ]
    procIf() {
        this.eat(Token_1.Token.TokenType.IF);
        this.procExpr();
        this.procCmd();
        if (this.match([Token_1.Token.TokenType.ELSE])) {
            this.procCmd();
        }
    }
    // <while> ::= while <expr> <cmd>
    procWhile() {
        this.eat(Token_1.Token.TokenType.WHILE);
        this.procExpr();
        this.procCmd();
    }
    // <for> ::= for ( <name> | ( var | let ) <name> ':' <type> ) in <expr> <cmd>
    procFor() {
        this.eat(Token_1.Token.TokenType.FOR);
        if (this.check([Token_1.Token.TokenType.NAME])) {
            this.procName();
        }
        else if (this.match([Token_1.Token.TokenType.VAR, Token_1.Token.TokenType.LET])) {
            this.procName();
            this.eat(Token_1.Token.TokenType.COLON);
            this.procType();
        }
        else {
            this.reportError();
        }
        this.eat(Token_1.Token.TokenType.IN);
        this.procExpr();
        this.procCmd();
    }
    // <assign> ::= [ <expr> '=' ] <expr> [ ';' ]
    procAssign() {
        let line = this.current.line;
        let rhs = this.procExpr();
        let lhs = null; // Inicializa com null
        if (this.match([Token_1.Token.TokenType.ASSIGN])) {
            if (!(rhs instanceof SetExpr_1.SetExpr)) {
                throw LanguageException_1.LanguageException.instance(this.previous.line, LanguageException_1.customErrors["InvalidOperation"]);
            }
            lhs = rhs;
            rhs = this.procExpr();
        }
        this.match([Token_1.Token.TokenType.SEMICOLON]);
        if (lhs === null) {
            throw LanguageException_1.LanguageException.instance(line, LanguageException_1.customErrors["InvalidOperation"]);
        }
        let acmd = new AssingCommand_1.AssignCommand(line, rhs, lhs);
        return acmd;
    }
    // <type> ::= <primitive> | <composed>
    procType() {
        if (this.check([Token_1.Token.TokenType.BOOL, Token_1.Token.TokenType.INT, Token_1.Token.TokenType.FLOAT,
            Token_1.Token.TokenType.CHAR, Token_1.Token.TokenType.STRING])) {
            return this.procPrimitive();
        }
        else if (this.check([Token_1.Token.TokenType.ARRAY, Token_1.Token.TokenType.DICT])) {
            return this.procComposed();
        }
        else {
            this.reportError();
            return BoolType_1.BoolType.instance();
            // Adicione um retorno padrão para tratar o erro
        }
    }
    // <primitive> ::= Bool | Int | Float | Char | String
    procPrimitive() {
        if (this.match([Token_1.Token.TokenType.BOOL, Token_1.Token.TokenType.INT, Token_1.Token.TokenType.FLOAT, Token_1.Token.TokenType.CHAR, Token_1.Token.TokenType.STRING])) {
            switch (this.previous.type) {
                case Token_1.Token.TokenType.BOOL:
                    return BoolType_1.BoolType.instance();
                case Token_1.Token.TokenType.INT:
                    return IntType_1.IntType.instance();
                case Token_1.Token.TokenType.FLOAT:
                    return FloatType_1.FloatType.instance();
                case Token_1.Token.TokenType.CHAR:
                    return CharType_1.CharType.instance();
                case Token_1.Token.TokenType.STRING:
                    return StringType_1.StringType.instance();
                default:
                    this.reportError();
            }
        }
        else {
            this.reportError();
        }
        // Você pode lançar uma exceção aqui ou retornar um valor padrão, dependendo dos requisitos do seu código.
        throw LanguageException_1.LanguageException.instance(this.previous.line, LanguageException_1.customErrors["InvalidValue"]);
    }
    // <composed> ::= <arraytype> | <dicttype>
    procComposed() {
        if (this.check([Token_1.Token.TokenType.ARRAY])) {
            this.procArrayType();
        }
        else if (this.check([Token_1.Token.TokenType.DICT])) {
            this.procDictType();
        }
        else {
            this.reportError();
        }
    }
    // <arraytype> ::= Array '<' <type> '>'
    procArrayType() {
        this.eat(Token_1.Token.TokenType.ARRAY);
        this.eat(Token_1.Token.TokenType.LOWER_THAN);
        this.procType();
        this.eat(Token_1.Token.TokenType.GREATER_THAN);
    }
    // <dicttype> ::= Dict '<' <type> ',' <type> '>'
    procDictType() {
        this.eat(Token_1.Token.TokenType.DICT);
        this.eat(Token_1.Token.TokenType.LOWER_THAN);
        this.procType();
        this.eat(Token_1.Token.TokenType.COMMA);
        this.procType();
        this.eat(Token_1.Token.TokenType.GREATER_THAN);
    }
    // <expr> ::= <cond> [ '?' <expr> ':' <expr> ]
    procExpr() {
        let expr = this.procCond();
        if (this.match([Token_1.Token.TokenType.TERNARY])) {
            this.procExpr();
            this.eat(Token_1.Token.TokenType.COLON);
            this.procExpr();
        }
        return expr;
    }
    // <cond> ::= <rel> { ( '&&' | '||' ) <rel> }
    procCond() {
        let expr = this.procRel();
        while (this.match([Token_1.Token.TokenType.AND, Token_1.Token.TokenType.OR])) {
            this.procRel();
        }
        return expr;
    }
    // <rel> ::= <arith> [ ( '<' | '>' | '<=' | '>=' | '==' | '!=' ) <arith> ]
    procRel() {
        let expr = this.procArith();
        if (this.match([
            Token_1.Token.TokenType.LOWER_THAN, Token_1.Token.TokenType.GREATER_THAN, Token_1.Token.TokenType.LOWER_EQUAL,
            Token_1.Token.TokenType.GREATER_EQUAL, Token_1.Token.TokenType.EQUAL, Token_1.Token.TokenType.NOT_EQUAL
        ])) {
            this.procArith();
        }
        return expr;
    }
    // <arith> ::= <term> { ( '+' | '-' ) <term> }
    procArith() {
        let expr = this.procTerm();
        while (this.match([Token_1.Token.TokenType.ADD, Token_1.Token.TokenType.SUB])) {
            this.procTerm();
        }
        return expr;
    }
    // <term> ::= <prefix> { ( '*' | '/' ) <prefix> }
    procTerm() {
        let expr = this.procPrefix();
        while (this.match([Token_1.Token.TokenType.MUL, Token_1.Token.TokenType.DIV])) {
            this.procPrefix();
        }
        return expr;
    }
    // <prefix> ::= [ '!' | '-' ] <factor>
    procPrefix() {
        let op = null;
        let line = -1;
        if (this.previous) {
            if (this.match([Token_1.Token.TokenType.NOT, Token_1.Token.TokenType.SUB])) {
                switch (this.previous.type) {
                    case Token_1.Token.TokenType.NOT:
                        op = UnaryExpr_1.Operator.Not;
                        break;
                    case Token_1.Token.TokenType.SUB:
                        op = UnaryExpr_1.Operator.Neg;
                        break;
                    default:
                        this.reportError();
                }
            }
            line = this.previous.line;
        }
        let expr = this.procFactor();
        if (op !== null)
            expr = new UnaryExpr_1.UnaryExpr(line, expr, op);
        return expr;
    }
    // <factor> ::= ( '(' <expr> ')' | <rvalue> ) <function>
    procFactor() {
        let expr;
        if (this.match([Token_1.Token.TokenType.OPEN_PAR])) {
            expr = this.procExpr();
            this.eat(Token_1.Token.TokenType.CLOSE_PAR);
        }
        else {
            expr = this.procRValue();
        }
        this.procFunction();
        return expr;
    }
    // <rvalue> ::= <const> | <action> | <cast> | <array> | <dict> | <lvalue>
    procRValue() {
        let expr = null; // Inicialize com null
        if (this.check([
            Token_1.Token.TokenType.FALSE, Token_1.Token.TokenType.TRUE,
            Token_1.Token.TokenType.INTEGER_LITERAL, Token_1.Token.TokenType.FLOAT_LITERAL,
            Token_1.Token.TokenType.CHAR_LITERAL, Token_1.Token.TokenType.STRING_LITERAL
        ])) {
            expr = this.procConst();
        }
        else if (this.check([Token_1.Token.TokenType.READ, Token_1.Token.TokenType.RANDOM])) {
            this.procAction();
        }
        else if (this.check([
            Token_1.Token.TokenType.TO_BOOL, Token_1.Token.TokenType.TO_INT,
            Token_1.Token.TokenType.TO_FLOAT, Token_1.Token.TokenType.TO_CHAR, Token_1.Token.TokenType.TO_STRING
        ])) {
            this.procCast();
        }
        else if (this.check([Token_1.Token.TokenType.ARRAY])) {
            this.procArray();
        }
        else if (this.check([Token_1.Token.TokenType.DICT])) {
            this.procDict();
        }
        else if (this.check([Token_1.Token.TokenType.NAME])) {
            expr = this.procLValue();
        }
        else {
            this.reportError();
        }
        if (expr === null) {
            throw LanguageException_1.LanguageException.instance(this.current.line, LanguageException_1.customErrors["InvalidOperation"]);
        }
        return expr;
    }
    // <const> ::= <bool> | <int> | <float> | <char> | <string>
    procConst() {
        let value = new Value_1.Value(BoolType_1.BoolType.instance(), false);
        if (this.check([Token_1.Token.TokenType.FALSE, Token_1.Token.TokenType.TRUE])) {
            value = this.procBool();
        }
        else if (this.check([Token_1.Token.TokenType.INTEGER_LITERAL])) {
            value = this.procInt();
        }
        else if (this.check([Token_1.Token.TokenType.FLOAT_LITERAL])) {
            value = this.procFloat();
        }
        else if (this.check([Token_1.Token.TokenType.CHAR_LITERAL])) {
            value = this.procChar();
        }
        else if (this.check([Token_1.Token.TokenType.STRING_LITERAL])) {
            value = this.procString();
        }
        else {
            this.reportError();
        }
        let line = -1;
        if (this.previous) {
            line = this.previous.line;
        }
        let cexpr = new ConstExpr_1.ConstExpr(line, value);
        return cexpr;
    }
    // <bool> ::= false | true
    procBool() {
        let value = null; // Inicialize com null
        if (this.match([Token_1.Token.TokenType.FALSE, Token_1.Token.TokenType.TRUE])) {
            if (this.previous) {
                switch (this.previous.type) {
                    case Token_1.Token.TokenType.FALSE:
                        value = new Value_1.Value(BoolType_1.BoolType.instance(), false);
                        break;
                    case Token_1.Token.TokenType.TRUE:
                        value = new Value_1.Value(BoolType_1.BoolType.instance(), true);
                        break;
                    default:
                        this.reportError();
                }
            }
        }
        else {
            this.reportError();
        }
        if (value === null) {
            throw LanguageException_1.LanguageException.instance(this.current.line, LanguageException_1.customErrors["InvalidOperation"]);
        }
        return value;
    }
    // <action> ::= ( read  | random ) '(' ')'
    procAction() {
        if (this.match([Token_1.Token.TokenType.READ, Token_1.Token.TokenType.RANDOM])) {
            // Não fazer nada.
        }
        else {
            this.reportError();
        }
        this.eat(Token_1.Token.TokenType.OPEN_PAR);
        this.eat(Token_1.Token.TokenType.CLOSE_PAR);
    }
    // <cast> ::= ( toBool | toInt | toFloat | toChar | toString ) '(' <expr> ')'
    procCast() {
        this.match([Token_1.Token.TokenType.TO_BOOL, Token_1.Token.TokenType.TO_INT, Token_1.Token.TokenType.TO_FLOAT, Token_1.Token.TokenType.TO_CHAR, Token_1.Token.TokenType.TO_STRING]);
        this.eat(Token_1.Token.TokenType.OPEN_PAR);
        this.procExpr();
        this.eat(Token_1.Token.TokenType.CLOSE_PAR);
    }
    // <array> ::= <arraytype> '(' [ <expr> { ',' <expr> } ] ')'
    procArray() {
        this.procArrayType();
        this.eat(Token_1.Token.TokenType.OPEN_PAR);
        if (!this.check([Token_1.Token.TokenType.CLOSE_PAR])) {
            this.procExpr();
            while (this.match([Token_1.Token.TokenType.COMMA])) {
                this.procExpr();
            }
        }
        this.eat(Token_1.Token.TokenType.CLOSE_PAR);
    }
    // <dict> ::= <dictype> '(' [ <expr> ':' <expr> { ',' <expr> ':' <expr> } ] ')'
    procDict() {
        this.procDictType();
        this.eat(Token_1.Token.TokenType.OPEN_PAR);
        if (!this.check([Token_1.Token.TokenType.CLOSE_PAR])) {
            this.procExpr();
            this.eat(Token_1.Token.TokenType.COLON);
            this.procExpr();
            while (this.match([Token_1.Token.TokenType.COMMA])) {
                this.procExpr();
                this.eat(Token_1.Token.TokenType.COLON);
                this.procExpr();
            }
        }
        this.eat(Token_1.Token.TokenType.CLOSE_PAR);
    }
    // <lvalue> ::= <name> { '[' <expr> ']' }
    procLValue() {
        let name = this.procName();
        let sexpr = this.environment.get(name);
        while (this.match([Token_1.Token.TokenType.OPEN_BRA])) {
            this.procExpr();
            this.eat(Token_1.Token.TokenType.CLOSE_BRA);
        }
        return sexpr;
    }
    // <function> ::= { '.' ( <fnoargs> | <fonearg> ) }
    procFunction() {
        while (this.match([Token_1.Token.TokenType.DOT])) {
            if (this.check([Token_1.Token.TokenType.APPEND, Token_1.Token.TokenType.CONTAINS])) {
                this.procFOneArg();
            }
            else {
                this.procFNoArgs();
            }
        }
    }
    // <fnoargs> ::= ( count | empty | keys | values ) '(' ')'
    procFNoArgs() {
        this.match([Token_1.Token.TokenType.COUNT, Token_1.Token.TokenType.EMPTY, Token_1.Token.TokenType.KEYS, Token_1.Token.TokenType.VALUES]);
        this.eat(Token_1.Token.TokenType.OPEN_PAR);
        this.eat(Token_1.Token.TokenType.CLOSE_PAR);
    }
    // <fonearg> ::= ( append | contains ) '(' <expr> ')'
    procFOneArg() {
        this.match([Token_1.Token.TokenType.APPEND, Token_1.Token.TokenType.CONTAINS]);
        this.eat(Token_1.Token.TokenType.OPEN_PAR);
        this.procExpr();
        this.eat(Token_1.Token.TokenType.CLOSE_PAR);
    }
    procName() {
        this.eat(Token_1.Token.TokenType.NAME);
        if (this.previous) {
            return this.previous;
        }
        else {
            return this.current;
        }
    }
    procInt() {
        let value = this.current.literal;
        this.eat(Token_1.Token.TokenType.INTEGER_LITERAL);
        if (value !== null) {
            return value;
        }
        else {
            throw LanguageException_1.LanguageException.instance(this.current.line, LanguageException_1.customErrors["InvalidValue"]);
        }
    }
    procFloat() {
        let value = this.current.literal;
        this.eat(Token_1.Token.TokenType.FLOAT_LITERAL);
        if (value !== null) {
            return value;
        }
        else {
            throw LanguageException_1.LanguageException.instance(this.current.line, LanguageException_1.customErrors["InvalidValue"]);
        }
    }
    procChar() {
        let value = this.current.literal;
        this.eat(Token_1.Token.TokenType.CHAR_LITERAL);
        if (value !== null) {
            return value;
        }
        else {
            throw LanguageException_1.LanguageException.instance(this.current.line, LanguageException_1.customErrors["InvalidValue"]);
        }
    }
    procString() {
        let value = this.current.literal;
        this.eat(Token_1.Token.TokenType.STRING_LITERAL);
        if (value !== null) {
            return value;
        }
        else {
            // Trate o caso em que o valor é nulo, lançando uma exceção ou fazendo algo apropriado.
            throw LanguageException_1.LanguageException.instance(this.current.line, LanguageException_1.customErrors["InvalidValue"]);
        }
    }
}
exports.SyntaticAnalysis = SyntaticAnalysis;
