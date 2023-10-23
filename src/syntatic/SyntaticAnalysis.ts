import { LanguageException, customErrors } from "../error/LanguageException";
import { Environment } from "../interpreter/Environment";
import { Interpreter } from "../interpreter/Interpreter";
import { AssignCommand } from "../interpreter/command/AssignCommand";
import { BlocksCommand } from "../interpreter/command/BlocksCommand";
import { Command } from "../interpreter/command/Command";
import { DumpCommand } from "../interpreter/command/DumpCommand";
import { InitializeCommand } from "../interpreter/command/InitializeCommand";
import { WhileCommand } from "../interpreter/command/WhileCommand";
import { PrintCommand } from "../interpreter/command/PrintCommand";
import { ConstExpr } from "../interpreter/expr/ConstExpr";
import { Expr } from "../interpreter/expr/Expr";
import { BinaryExpr, BinaryOperator } from "../interpreter/expr/BinaryExpr";
import { SetExpr } from "../interpreter/expr/SetExpr";
import { Operator, UnaryExpr } from "../interpreter/expr/UnaryExpr";
import { Variable } from "../interpreter/expr/Variable";
import { Category, Type } from "../interpreter/type/Type";
import { PrimitiveType } from "../interpreter/type/primitive/PrimitiveType";
import { BoolType } from "../interpreter/type/primitive/types/BoolType";
import { CharType } from "../interpreter/type/primitive/types/CharType";
import { FloatType } from "../interpreter/type/primitive/types/FloatType";
import { IntType } from "../interpreter/type/primitive/types/IntType";
import { StringType } from "../interpreter/type/primitive/types/StringType";
import { Value } from "../interpreter/value/Value";
import { LexicalAnalysis } from "../lexical/LexicalAnalysis";
import { Token } from "../lexical/Token";
import { InternalException } from "../error/InternalException";
import { IfCommand } from "../interpreter/command/IfCommand";
import { ArrayType, ComposedType, DictType } from "../interpreter/type/composed/ComposedType";
import { ArrayExpr } from "../interpreter/expr/ArrayExpr";
import { DictExpr, DictItem } from "../interpreter/expr/DictExpr";
import { ForCommand } from "../interpreter/command/ForCommand";
import { FuncOp, FunctionExpr } from "../interpreter/expr/FunctionExpr";
import { CastExpr, CastOperator } from "../interpreter/expr/CastExpr";

export class SyntaticAnalysis {

    private lex: LexicalAnalysis;
    private current: Token;
    private previous: Token;
    private environment: Environment;

    constructor(lex: LexicalAnalysis) {
        this.lex = lex;
        this.current = lex.nextToken();
        this.previous = new Token("", Token.TokenType.END_OF_FILE, null);
        this.environment = Interpreter.globals;
    }

    public process(): Command {
        let cmd: Command = this.procCode();
        this.eat(Token.TokenType.END_OF_FILE);
        return cmd;
    }

    private advance(): void {
        console.log("Found " + this.current);
        this.previous = this.current;
        this.current = this.lex.nextToken();
    }

    private eat(type: Token.TokenType): void {
        if (type == this.current.type) {
            this.advance();
        } else {
            console.log(`Expected (${type}), found ` + this.current);
            this.reportError();
        }
    }

    private check(types: Token.TokenType[]): boolean {
        let found = false;
        types.forEach(type => {
            if (this.current.type == type) {
                found = true;
            }
        })

        return found;
    }

    private match(types: Token.TokenType[]): boolean {
        if (this.check(types)) {
            this.advance();
            return true;
        } else {
            return false;
        }
    }

    private reportError(): void {
        let line: number = this.current.line;
        switch (this.current.type) {
            case Token.TokenType.INVALID_TOKEN:
                throw LanguageException.instance(line, customErrors.InvalidLexeme, this.current.lexeme);
            case Token.TokenType.UNEXPECTED_EOF:
            case Token.TokenType.END_OF_FILE:
                throw LanguageException.instance(line, customErrors.UnexpectedEOF);
            default:
                throw LanguageException.instance(line, customErrors.UnexpectedLexeme, this.current.lexeme + " " + this.current.literal?.data);
        }
    }

    // <code> ::= { <cmd> }
    private procCode(): BlocksCommand {
        let line: number = this.current.line;
        let cmd: Command;
        let cmds: Command[] = []; // Inicialize cmds como um array vazio

        while (this.check([Token.TokenType.OPEN_CUR,
        Token.TokenType.VAR, Token.TokenType.LET,
        Token.TokenType.PRINT, Token.TokenType.PRINTLN,
        Token.TokenType.DUMP, Token.TokenType.IF,
        Token.TokenType.WHILE, Token.TokenType.FOR,
        Token.TokenType.NOT, Token.TokenType.SUB,
        Token.TokenType.OPEN_PAR, Token.TokenType.FALSE,
        Token.TokenType.TRUE, Token.TokenType.INTEGER_LITERAL,
        Token.TokenType.FLOAT_LITERAL, Token.TokenType.CHAR_LITERAL,
        Token.TokenType.STRING_LITERAL, Token.TokenType.READ,
        Token.TokenType.RANDOM, Token.TokenType.TO_BOOL,
        Token.TokenType.TO_INT, Token.TokenType.TO_FLOAT,
        Token.TokenType.TO_CHAR, Token.TokenType.TO_STRING,
        Token.TokenType.ARRAY, Token.TokenType.DICT, Token.TokenType.NAME])) {
            cmd = this.procCmd();
            if (cmd != null)
                cmds.push(cmd);
        }

        let bcmd: BlocksCommand = new BlocksCommand(line, cmds);
        return bcmd;
    }

    // <block> ::= '{' <code> '}'
    private procBlock(env?: Environment): BlocksCommand {
        this.eat(Token.TokenType.OPEN_CUR);

        let old: Environment = this.environment;
        if (env == undefined) {
            this.environment = new Environment(old);
        }
        else {
            this.environment = env;
        }

        let bcmd: BlocksCommand;

        try {
            bcmd = this.procCode();
            this.eat(Token.TokenType.CLOSE_CUR);
        } finally {
            this.environment = old;
        }

        return bcmd;
    }

    // <decl> ::= <var> | <let>
    private procDecl(): Command | null {
        let cmd: Command | null = null;
        if (this.check([Token.TokenType.VAR])) {
            cmd = this.procVar();
        } else if (this.check([Token.TokenType.LET])) {
            cmd = this.procLet();
        } else {
            this.reportError();
        }

        return cmd;
    }

    // <cmd> ::= <block> | <decl> | <print> | <dump> | <if> | <while> | <for> | <assign>
    private procCmd(env?: Environment): Command | any {
        let cmd: Command | null = null; // Inicialize com null

        if (this.check([Token.TokenType.OPEN_CUR])) {
            cmd = this.procBlock(env);
        } else if (this.check([Token.TokenType.VAR, Token.TokenType.LET])) {
            cmd = this.procDecl();
        } else if (this.check([Token.TokenType.PRINT, Token.TokenType.PRINTLN])) {
            cmd = this.procPrint();
        } else if (this.check([Token.TokenType.DUMP])) {
            cmd = this.procDump();
        } else if (this.check([Token.TokenType.IF])) {
            cmd = this.procIf();
        } else if (this.check([Token.TokenType.WHILE])) {
            cmd = this.procWhile();
        } else if (this.check([Token.TokenType.FOR])) {
            cmd = this.procFor();
        } else if (this.check([Token.TokenType.NOT, Token.TokenType.SUB,
        Token.TokenType.OPEN_PAR, Token.TokenType.FALSE,
        Token.TokenType.TRUE, Token.TokenType.INTEGER_LITERAL,
        Token.TokenType.FLOAT_LITERAL, Token.TokenType.CHAR_LITERAL,
        Token.TokenType.STRING_LITERAL, Token.TokenType.READ,
        Token.TokenType.RANDOM, Token.TokenType.TO_BOOL,
        Token.TokenType.TO_INT, Token.TokenType.TO_FLOAT,
        Token.TokenType.TO_CHAR, Token.TokenType.TO_STRING,
        Token.TokenType.ARRAY, Token.TokenType.DICT, Token.TokenType.NAME])) {
            cmd = this.procAssign();
        } else {
            this.reportError();
        }

        return cmd;
    }


    // <var> ::= var <name> ':' <type> [ '=' <expr> ] { ',' <name> ':' <type> [ '=' <expr> ] } [';']
    private procVar(): BlocksCommand {
        this.eat(Token.TokenType.VAR);
        let bline: number = this.previous.line;
        let name: Token = this.procName();
        this.eat(Token.TokenType.COLON);

        let type: Type = this.procType();
        let v: Variable = this.environment.declare(name, type, false);

        let cmds: Command[] = [];
        if (this.match([Token.TokenType.ASSIGN])) {
            let line: number = this.previous.line;
            let expr: Expr = this.procExpr();
            let icmd: InitializeCommand = new InitializeCommand(line, v, expr);
            cmds.push(icmd);
        }

        while (this.match([Token.TokenType.COMMA])) {
            name = this.procName();
            this.eat(Token.TokenType.COLON);

            type = this.procType();
            v = this.environment.declare(name, type, false);

            if (this.match([Token.TokenType.ASSIGN])) {
                let line: number = this.previous.line;
                let expr: Expr = this.procExpr();

                let cmds: Command[] = [];
                let icmd: InitializeCommand = new InitializeCommand(line, v, expr);
                cmds.push(icmd);
            }
        }

        this.match([Token.TokenType.SEMICOLON]);
        let bcmd: BlocksCommand = new BlocksCommand(bline, cmds);
        return bcmd;
    }

    // <let> ::= let <name> ':' <type> '=' <expr> { ',' <name> ':' <type> '=' <expr> } [';']
    private procLet(): BlocksCommand {
        this.eat(Token.TokenType.LET);
        let bline: number = this.previous.line;
        let name: Token = this.procName();
        this.eat(Token.TokenType.COLON);
        let type: Type = this.procType();
        let v: Variable = this.environment.declare(name, type, true);
        this.eat(Token.TokenType.ASSIGN);
        let line: number = this.previous.line;
        let expr: Expr = this.procExpr();

        let cmds: Command[] = [];
        let icmd: InitializeCommand = new InitializeCommand(line, v, expr);
        cmds.push(icmd);

        while (this.match([Token.TokenType.COMMA])) {
            name = this.procName();
            this.eat(Token.TokenType.COLON);
            type = this.procType();

            v = this.environment.declare(name, type, true);

            this.eat(Token.TokenType.ASSIGN);
            expr = this.procExpr();
            line = this.previous.line;

            icmd = new InitializeCommand(line, v, expr);
            cmds.push(icmd);
        }

        this.match([Token.TokenType.SEMICOLON]);

        let bcmd: BlocksCommand = new BlocksCommand(bline, cmds);
        return bcmd;
    }

    // <print> ::= (print | println) '(' <expr> ')' [';']
    private procPrint(): PrintCommand {
        let newLine: boolean = false;
        if (this.match([Token.TokenType.PRINT, Token.TokenType.PRINTLN])) {
            if (this.previous) {
                newLine = (this.previous.type == Token.TokenType.PRINTLN);
            }
        } else {
            this.reportError();
        }

        let line: number = -1;

        if (this.previous) line = this.previous.line;

        this.eat(Token.TokenType.OPEN_PAR);
        let expr: Expr = this.procExpr();
        this.eat(Token.TokenType.CLOSE_PAR);

        this.match([Token.TokenType.SEMICOLON]);

        let pcmd: PrintCommand = new PrintCommand(line, expr, newLine);

        return pcmd;
    }

    // <dump> ::= dump '(' <expr> ')' [';']
    private procDump(): DumpCommand {
        this.eat(Token.TokenType.DUMP);

        let line: number = -1;
        if (this.previous) line = this.previous.line;

        this.eat(Token.TokenType.OPEN_PAR);
        let expr: Expr = this.procExpr();
        this.eat(Token.TokenType.CLOSE_PAR);
        this.match([Token.TokenType.SEMICOLON]);

        let dcmd: DumpCommand = new DumpCommand(line, expr);
        return dcmd;
    }

    // <if> ::= if <expr> <cmd> [ else <cmd> ]
    private procIf(): IfCommand {
        this.eat(Token.TokenType.IF);
        let elseCmd: Command | undefined = undefined;
        let line: number = this.previous.line;
        let expr: Expr = this.procExpr();
        let thenCmd: Command = this.procCmd();
        if (this.match([Token.TokenType.ELSE])) {
            elseCmd = this.procCmd();
        }
        let icmd: IfCommand = new IfCommand(line, expr, thenCmd, elseCmd);
        return icmd;
    }

    // <while> ::= while <expr> <cmd>
    private procWhile(): WhileCommand {
        this.eat(Token.TokenType.WHILE);
        let line: number = this.previous.line;
        let expr: Expr = this.procExpr();
        let cmd: Command = this.procCmd();

        let wcmd: WhileCommand = new WhileCommand(line, expr, cmd);
        return wcmd;
    }

    // <for> ::= for ( <name> | ( var | let ) <name> ':' <type> ) in <expr> <cmd>
    private procFor(): ForCommand {
        this.eat(Token.TokenType.FOR);
        let line: number = this.previous.line;
        let env: Environment = new Environment(this.environment);
        let v: Variable;
        if (this.check([Token.TokenType.NAME])) {
            v = env.get(this.procName());
        } else if (this.match([Token.TokenType.VAR, Token.TokenType.LET])) {
            let name: Token = this.procName();
            this.eat(Token.TokenType.COLON);
            let type: Type = this.procType();
            v = env.declare(name, type, false);
        } else {
            throw this.reportError();
        }

        this.eat(Token.TokenType.IN);
        let expr = this.procExpr();
        let cmd = this.procCmd(env);
        let fcmd: ForCommand = new ForCommand(line, expr, cmd, v);
        return fcmd;
    }

    // <assign> ::= [ <expr> '=' ] <expr> [ ';' ]
    private procAssign(): AssignCommand {
        let line: number = this.current.line;
        let rhs: Expr = this.procExpr();
        let lhs: SetExpr | null = null; // Inicializa com null

        if (this.match([Token.TokenType.ASSIGN])) {
            if (!(rhs instanceof SetExpr)) {
                throw LanguageException.instance(this.previous.line, customErrors.InvalidOperation);
            }

            lhs = rhs as SetExpr;
            rhs = this.procExpr();
        }

        this.match([Token.TokenType.SEMICOLON]);

        if (lhs === null) {
            throw LanguageException.instance(line, customErrors.InvalidOperation);
        }

        let acmd: AssignCommand = new AssignCommand(line, rhs, lhs);
        return acmd;
    }

    // <type> ::= <primitive> | <composed>
    private procType(): Type {
        if (this.check(
            [Token.TokenType.BOOL, Token.TokenType.INT, Token.TokenType.FLOAT,
            Token.TokenType.CHAR, Token.TokenType.STRING]
        )) {
            return this.procPrimitive();
        } else if (this.check([Token.TokenType.ARRAY, Token.TokenType.DICT])) {
            return this.procComposed();
        } else {
            throw this.reportError();
        }
    }

    // <primitive> ::= Bool | Int | Float | Char | String
    private procPrimitive(): PrimitiveType {
        if (this.match([Token.TokenType.BOOL, Token.TokenType.INT, Token.TokenType.FLOAT, Token.TokenType.CHAR, Token.TokenType.STRING])) {
            switch (this.previous.type) {
                case Token.TokenType.BOOL:
                    return BoolType.instance();
                case Token.TokenType.INT:
                    return IntType.instance();
                case Token.TokenType.FLOAT:
                    return FloatType.instance();
                case Token.TokenType.CHAR:
                    return CharType.instance();
                case Token.TokenType.STRING:
                    return StringType.instance();
                default:
                    this.reportError();
            }
        }

        throw this.reportError();
    }

    // <composed> ::= <arraytype> | <dicttype>
    private procComposed(): ComposedType {
        let ct: ComposedType = ArrayType.instance(Category.Array, BoolType.instance());
        if (this.check([Token.TokenType.ARRAY])) {
            ct = this.procArrayType();
        } else if (this.check([Token.TokenType.DICT])) {
            ct = this.procDictType();
        } else {
            this.reportError();
        }

        return ct;
    }

    // <arraytype> ::= Array '<' <type> '>'
    private procArrayType(): ArrayType {
        this.eat(Token.TokenType.ARRAY);
        this.eat(Token.TokenType.LOWER_THAN);
        let type = this.procType();
        this.eat(Token.TokenType.GREATER_THAN);
        return ArrayType.instance(Category.Array, type);
    }

    // <dicttype> ::= Dict '<' <type> ',' <type> '>'
    private procDictType(): DictType {
        this.eat(Token.TokenType.DICT);
        this.eat(Token.TokenType.LOWER_THAN);
        let type1 = this.procType();
        this.eat(Token.TokenType.COMMA);
        let type2 = this.procType();
        this.eat(Token.TokenType.GREATER_THAN);
        return DictType.instance(Category.Dict, type1, type2);
    }

    // <expr> ::= <cond> [ '?' <expr> ':' <expr> ]
    private procExpr(): Expr {
        let expr: Expr = this.procCond();
        if (this.match([Token.TokenType.TERNARY])) {
            this.procExpr();
            this.eat(Token.TokenType.COLON);
            this.procExpr();
        }
        return expr;
    }

    // <cond> ::= <rel> { ( '&&' | '||' ) <rel> }
    private procCond(): Expr {
        let expr: Expr = this.procRel();
        while (this.match([Token.TokenType.AND, Token.TokenType.OR])) {
            this.procRel();
        }
        return expr;
    }

    // <rel> ::= <arith> [ ( '<' | '>' | '<=' | '>=' | '==' | '!=' ) <arith> ]
    private procRel(): Expr {
        let left: Expr = this.procArith();

        if (this.match([
            Token.TokenType.LOWER_THAN, Token.TokenType.GREATER_THAN, Token.TokenType.LOWER_EQUAL,
            Token.TokenType.GREATER_EQUAL, Token.TokenType.EQUAL, Token.TokenType.NOT_EQUAL
        ])) {
            let line: number = this.previous.line;

            let op: BinaryOperator;

            switch (this.previous.type) {
                case Token.TokenType.LOWER_THAN:
                    op = BinaryOperator.LowerThan;
                    break;
                case Token.TokenType.GREATER_THAN:
                    op = BinaryOperator.GreaterThan;
                    break;
                case Token.TokenType.LOWER_EQUAL:
                    op = BinaryOperator.LowerEqual;
                    break;
                case Token.TokenType.GREATER_EQUAL:
                    op = BinaryOperator.GreaterEqual;
                    break;
                case Token.TokenType.EQUAL:
                    op = BinaryOperator.Equal;
                    break;
                case Token.TokenType.NOT_EQUAL:
                    op = BinaryOperator.NotEqual;
                    break;
                default:
                    throw new InternalException("Unreacheable");
            }
            let right: Expr = this.procArith();
            left = new BinaryExpr(line, left, op, right);
        }

        return left;
    }

    // <arith> ::= <term> { ( '+' | '-' ) <term> }
    private procArith(): Expr {
        let left: Expr = this.procTerm();
        while (this.match([Token.TokenType.ADD, Token.TokenType.SUB])) {
            let line: number = this.previous.line;
            let op: BinaryOperator = this.previous.type == Token.TokenType.ADD ?
                BinaryOperator.Add : BinaryOperator.Sub;
            let right: Expr = this.procTerm();
            left = new BinaryExpr(line, left, op, right);
        }
        return left;
    }

    // <term> ::= <prefix> { ( '*' | '/' ) <prefix> }
    private procTerm(): Expr {
        let left: Expr = this.procPrefix();

        while (this.match([Token.TokenType.MUL, Token.TokenType.DIV])) {
            let line: number = this.previous.line;
            let op: BinaryOperator = this.previous.type == Token.TokenType.MUL ?
                BinaryOperator.Mul : BinaryOperator.Div;
            let right: Expr = this.procPrefix();
            left = new BinaryExpr(line, left, op, right);
        }

        return left;
    }

    // <prefix> ::= [ '!' | '-' ] <factor>
    private procPrefix(): Expr {
        let op: Operator | null = null;
        let line = -1;

        if (this.previous) {
            if (this.match([Token.TokenType.NOT, Token.TokenType.SUB])) {
                switch (this.previous.type) {
                    case Token.TokenType.NOT:
                        op = Operator.Not;
                        break;
                    case Token.TokenType.SUB:
                        op = Operator.Neg;
                        break;
                    default:
                        this.reportError();
                }
            }

            line = this.previous.line;

        }

        let expr: Expr = this.procFactor();

        if (op !== null) expr = new UnaryExpr(line, expr, op);

        return expr;
    }

    // <factor> ::= ( '(' <expr> ')' | <rvalue> ) <function>
    private procFactor(): Expr {
        let expr: Expr;

        if (this.match([Token.TokenType.OPEN_PAR])) {
            expr = this.procExpr();
            this.eat(Token.TokenType.CLOSE_PAR);
        } else {
            expr = this.procRValue();
        }
        let funcExpr: Expr | undefined = this.procFunction(expr);
        if (funcExpr) {
            return funcExpr;
        }
        return expr;
    }

    // <rvalue> ::= <const> | <action> | <cast> | <array> | <dict> | <lvalue>
    private procRValue(): Expr {
        let expr: Expr | null = null;

        if (this.check([
            Token.TokenType.FALSE, Token.TokenType.TRUE,
            Token.TokenType.INTEGER_LITERAL, Token.TokenType.FLOAT_LITERAL,
            Token.TokenType.CHAR_LITERAL, Token.TokenType.STRING_LITERAL
        ])) {
            expr = this.procConst();
        } else if (this.check([Token.TokenType.READ, Token.TokenType.RANDOM])) {
            this.procAction();
        } else if (this.check([
            Token.TokenType.TO_BOOL, Token.TokenType.TO_INT,
            Token.TokenType.TO_FLOAT, Token.TokenType.TO_CHAR, Token.TokenType.TO_STRING
        ])) {
            expr = this.procCast();
        } else if (this.check([Token.TokenType.ARRAY])) {
            expr = this.procArray();
        } else if (this.check([Token.TokenType.DICT])) {
            expr = this.procDict();
        } else if (this.check([Token.TokenType.NAME])) {
            expr = this.procLValue();
        } else {
            this.reportError();
        }

        if (expr === null) {
            throw LanguageException.instance(this.current.line, customErrors.InvalidOperation);
        }

        return expr;
    }

    // <const> ::= <bool> | <int> | <float> | <char> | <string>
    private procConst(): Expr {
        let value: Value = new Value(BoolType.instance(), false);

        if (this.check([Token.TokenType.FALSE, Token.TokenType.TRUE])) {
            value = this.procBool();
        } else if (this.check([Token.TokenType.INTEGER_LITERAL])) {
            value = this.procInt();
        } else if (this.check([Token.TokenType.FLOAT_LITERAL])) {
            value = this.procFloat();
        } else if (this.check([Token.TokenType.CHAR_LITERAL])) {
            value = this.procChar();
        } else if (this.check([Token.TokenType.STRING_LITERAL])) {
            value = this.procString();
        } else {
            this.reportError();
        }
        let line: number = -1;
        if (this.previous) {
            line = this.previous.line;
        }

        let cexpr: ConstExpr = new ConstExpr(line, value);
        return cexpr;
    }

    // <bool> ::= false | true
    private procBool(): Value {
        let value: Value | null = null; // Inicialize com null

        if (this.match([Token.TokenType.FALSE, Token.TokenType.TRUE])) {
            if (this.previous) {
                switch (this.previous.type) {
                    case Token.TokenType.FALSE:
                        value = new Value(BoolType.instance(), false);
                        break;
                    case Token.TokenType.TRUE:
                        value = new Value(BoolType.instance(), true);
                        break;
                    default:
                        this.reportError();
                }
            }
        } else {
            throw this.reportError();
        }

        if (value == null) {
            throw this.reportError();
        }

        return value;
    }

    // <action> ::= ( read  | random ) '(' ')'
    private procAction() {
        if (this.match([Token.TokenType.READ, Token.TokenType.RANDOM])) {
            // Não fazer nada.
        } else {
            this.reportError();
        }

        this.eat(Token.TokenType.OPEN_PAR);
        this.eat(Token.TokenType.CLOSE_PAR);
    }

    // <cast> ::= ( toBool | toInt | toFloat | toChar | toString ) '(' <expr> ')'
    private procCast(): CastExpr {
        let line = this.current.line;
        let op: CastOperator;

        this.match([Token.TokenType.TO_BOOL, Token.TokenType.TO_INT, Token.TokenType.TO_FLOAT, Token.TokenType.TO_CHAR, Token.TokenType.TO_STRING]);

        switch (this.previous.type) {
            case Token.TokenType.TO_BOOL:
                op = CastOperator.toBoolOp;
                break;
            case Token.TokenType.TO_INT:
                op = CastOperator.toIntOp;
                break;
            case Token.TokenType.TO_FLOAT:
                op = CastOperator.toFloatOp;
                break;
            case Token.TokenType.TO_CHAR:
                op = CastOperator.toCharOp;
                break;
            case Token.TokenType.TO_STRING:
                op = CastOperator.toStringOp;
                break;
            default:
                throw this.reportError();
        }
        this.eat(Token.TokenType.OPEN_PAR);
        let argExpr = this.procExpr();
        let cExpr = new CastExpr(line, op, argExpr);
        this.eat(Token.TokenType.CLOSE_PAR);
        return cExpr;
    }

    // <array> ::= <arraytype> '(' [ <expr> { ',' <expr> } ] ')'
    private procArray(): ArrayExpr {
        let arrayType = this.procArrayType();
        let line = this.previous.line;
        this.eat(Token.TokenType.OPEN_PAR);
        let itens: Expr[] = [];
        if (!this.check([Token.TokenType.CLOSE_PAR])) {
            itens.push(this.procExpr());
            while (this.match([Token.TokenType.COMMA])) {
                itens.push(this.procExpr());
            }
        }
        this.eat(Token.TokenType.CLOSE_PAR);
        let arrayexpr = new ArrayExpr(line, arrayType.getInnerType(), itens);
        return arrayexpr;
    }

    // <dict> ::= <dictype> '(' [ <expr> ':' <expr> { ',' <expr> ':' <expr> } ] ')'
    private procDict(): DictExpr {
        let dictType = this.procDictType();
        let line = this.previous.line;
        this.eat(Token.TokenType.OPEN_PAR);
        let dictItens: DictItem[] = [];
        let dictItem: DictItem = {} as DictItem;
        if (!this.check([Token.TokenType.CLOSE_PAR])) {
            dictItem.key = this.procExpr();
            this.eat(Token.TokenType.COLON);
            dictItem.value = this.procExpr();
            dictItens.push(dictItem);
            while (this.match([Token.TokenType.COMMA])) {
                let dictItem: DictItem = {} as DictItem;
                dictItem.key = this.procExpr();
                this.eat(Token.TokenType.COLON);
                dictItem.value = this.procExpr();
                dictItens.push(dictItem);
            }
        }

        this.eat(Token.TokenType.CLOSE_PAR);
        let dexpr = new DictExpr(line, dictType, dictItens);
        return dexpr;
    }

    // <lvalue> ::= <name> { '[' <expr> ']' }
    private procLValue(): SetExpr {
        let name: Token = this.procName();
        let line = this.previous.line;
        let sexpr: SetExpr = this.environment.get(name);
        if (this.match([Token.TokenType.OPEN_BRA])) {
            let expr = this.procExpr();
            this.eat(Token.TokenType.CLOSE_BRA);
            let accExpr: AccessExpr = new AccessExpr(line, sexpr, expr);
            return accExpr;
        }

        return sexpr;
    }

    // <function> ::= { '.' ( <fnoargs> | <fonearg> ) }
    private procFunction(expr: Expr): Expr | undefined {
        let value: Expr | undefined;
        while (this.match([Token.TokenType.DOT])) {
            if (this.check([Token.TokenType.APPEND, Token.TokenType.CONTAINS])) {
                value = this.procFOneArg(expr);
            } else {
                value = this.procFNoArgs(expr);
            }
        }
        return value;
    }

    // <fnoargs> ::= ( count | empty | keys | values ) '(' ')'
    private procFNoArgs(expr: Expr): FunctionExpr {
        let op: FuncOp;
        let line = this.previous.line;
        this.match([Token.TokenType.COUNT, Token.TokenType.EMPTY, Token.TokenType.KEYS, Token.TokenType.VALUES]);
        switch (this.previous.type) {
            case Token.TokenType.COUNT:
                op = FuncOp.Count;
                break;
            case Token.TokenType.EMPTY:
                op = FuncOp.Empty;
                break;
            case Token.TokenType.KEYS:
                op = FuncOp.Keys;
                break;
            case Token.TokenType.VALUES:
                op = FuncOp.Values;
                break;
            default:
                throw this.reportError();
        }
        this.eat(Token.TokenType.OPEN_PAR);
        this.eat(Token.TokenType.CLOSE_PAR);
        let fexpr = new FunctionExpr(line, op, expr);
        return fexpr;
    }

    // <fonearg> ::= ( append | contains ) '(' <expr> ')'
    private procFOneArg(expr: Expr): FunctionExpr {
        let op: FuncOp;
        let line = this.previous.line;
        this.match([Token.TokenType.APPEND, Token.TokenType.CONTAINS]);
        switch (this.previous.type) {
            case Token.TokenType.CONTAINS:
                op = FuncOp.Contains;
                break;
            case Token.TokenType.APPEND:
                op = FuncOp.Append;
                break;
            default:
                throw this.reportError();
        }
        this.eat(Token.TokenType.OPEN_PAR);
        let exprArg = this.procExpr();
        let fexpr = new FunctionExpr(line, op, expr, exprArg);
        this.eat(Token.TokenType.CLOSE_PAR);
        return fexpr;
    }

    private procName(): Token {
        this.eat(Token.TokenType.NAME);
        if (this.previous) {
            return this.previous;
        } else {
            return this.current;
        }
    }

    private procInt(): Value {
        let value: Value | null = this.current.literal;
        this.eat(Token.TokenType.INTEGER_LITERAL);
        if (value != null) {
            return value;
        } else {
            throw LanguageException.instance(this.current.line, customErrors.InvalidValue);
        }
    }

    private procFloat(): Value {
        let value: Value | null = this.current.literal;
        this.eat(Token.TokenType.FLOAT_LITERAL);
        if (value != null) {
            return value;
        } else {
            throw LanguageException.instance(this.current.line, customErrors.InvalidValue);
        }
    }

    private procChar(): Value {
        let value: Value | null = this.current.literal;
        this.eat(Token.TokenType.CHAR_LITERAL);
        if (value != null) {
            return value;
        } else {
            throw LanguageException.instance(this.current.line, customErrors.InvalidValue);
        }
    }

    private procString(): Value {
        let value: Value | null = this.current.literal;
        this.eat(Token.TokenType.STRING_LITERAL);
        if (value != null) {
            return value;
        } else {
            throw LanguageException.instance(this.current.line, customErrors.InvalidValue);
        }
    }

}