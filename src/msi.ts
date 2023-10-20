import { createReadStream, ReadStream } from 'fs';
import { LexicalAnalysis } from './lexical/LexicalAnalysis';
import { SyntaticAnalysis } from './syntatic/SyntaticAnalysis';
import { Command } from './interpreter/command/Command';
import { Interpreter } from './interpreter/Interpreter';

function runPrompt() {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.prompt();

    rl.on('line', (line: ReadStream) => {
        run(line);
        rl.prompt();
    });
}

function runFile(filename: string) {
    const fileStream: ReadStream = createReadStream(filename);
    run(fileStream);
}

function run(inputStream: ReadStream) {
    const lex = new LexicalAnalysis('teste.muel');
    const syntax = new SyntaticAnalysis(lex);
    const cmd: Command = syntax.process();
    Interpreter.interpret(cmd);
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
