import * as fs from 'fs';
import { ReadStream } from 'fs';
import { LexicalAnalysis } from './lexical/LexicalAnalysis';
import { SyntaticAnalysis } from './syntatic/SyntaticAnalysis';
import { Command } from './interpreter/command/Command';
import { Interpreter } from './interpreter/Interpreter';
import { LanguageException } from './error/LanguageException';

async function streamToString(stream: ReadStream): Promise<string> {
    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf-8");
}

function runPrompt() {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.prompt();

    let stringInput = "";

    rl.on('line', async (line: ReadStream) => {

        if (line === null) {
            rl.close();
            return;
        }

        stringInput = await streamToString(line);

        run(stringInput.split(''));
        rl.prompt();

    });

    rl.on('close', () => {
        process.exit(0);
    });
}

function runFile(filename: string) {
    run(fs.readFileSync(filename, 'utf8').split(''));
}

function run(inputString: string[]) {
    try {
        const lex = new LexicalAnalysis(inputString);
        const syntax = new SyntaticAnalysis(lex);
        const cmd: Command = syntax.process();
        Interpreter.interpret(cmd);

    }
    catch (e: any) {
        if (e instanceof LanguageException) {
            console.log(e.message);
        } else {
            console.error(`Internal error: ${e.message}`);
            console.error(e.stack);
        }
    }
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
