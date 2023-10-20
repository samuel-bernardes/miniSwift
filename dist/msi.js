"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const LexicalAnalysis_1 = require("./lexical/LexicalAnalysis");
const SyntaticAnalysis_1 = require("./syntatic/SyntaticAnalysis");
const Interpreter_1 = require("./interpreter/Interpreter");
function runPrompt() {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.prompt();
    rl.on('line', (line) => {
        run(line);
        rl.prompt();
    });
}
function runFile(filename) {
    const fileStream = (0, fs_1.createReadStream)(filename);
    run(fileStream);
}
function run(inputStream) {
    const lex = new LexicalAnalysis_1.LexicalAnalysis('teste.muel');
    const syntax = new SyntaticAnalysis_1.SyntaticAnalysis(lex);
    const cmd = syntax.process();
    Interpreter_1.Interpreter.interpret(cmd);
    /* try {
        let token: Token;
        do {
            token = lex.nextToken();
            console.log(`${token.line}: ("${token.lexeme}", ${token.type}, ${token.literal})`);
        } while (
            token.type !== Token.TokenType.END_OF_FILE &&
            token.type !== Token.TokenType.INVALID_TOKEN &&
            token.type !== Token.TokenType.UNEXPECTED_EOF
        );

        // O código a seguir é dado para testar o interpretador.
        // Descomente após o analisador léxico estar pronto.
        // const syntacticAnalysis = new SyntaticAnalysis(lex);
        // const cmd = syntacticAnalysis.process();
        // Interpreter.interpret(cmd);

    } catch (e: any) {
        if (e instanceof LanguageException) {
            console.log(e.message);
        } else {
            console.error(`Internal error: ${e.message}`);
            console.error(e.stack);
        }
    } */
}
const args = process.argv.slice(2);
switch (args.length) {
    case 0:
        runPrompt();
        break;
    case 1:
        runFile(args[0]);
        break;
    default:
        console.log('Usage: ts-node msi.ts [miniSwift file]');
        break;
}
