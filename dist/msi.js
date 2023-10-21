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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const LexicalAnalysis_1 = require("./lexical/LexicalAnalysis");
const SyntaticAnalysis_1 = require("./syntatic/SyntaticAnalysis");
const Interpreter_1 = require("./interpreter/Interpreter");
function streamToString(stream) {
    var _a, stream_1, stream_1_1;
    var _b, e_1, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        // lets have a ReadableStream as a stream variable
        const chunks = [];
        try {
            for (_a = true, stream_1 = __asyncValues(stream); stream_1_1 = yield stream_1.next(), _b = stream_1_1.done, !_b; _a = true) {
                _d = stream_1_1.value;
                _a = false;
                const chunk = _d;
                chunks.push(Buffer.from(chunk));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = stream_1.return)) yield _c.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return Buffer.concat(chunks).toString("utf-8");
    });
}
function runPrompt() {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.prompt();
    let stringInput = "";
    rl.on('line', (line) => __awaiter(this, void 0, void 0, function* () {
        if (line === null) {
            rl.close();
            return;
        }
        stringInput = yield streamToString(line);
        run(stringInput.split(''));
        rl.prompt();
    }));
    rl.on('close', () => {
        process.exit(0);
    });
}
function runFile(filename) {
    run(fs.readFileSync(filename, 'utf8').split(''));
}
function run(inputString) {
    const lex = new LexicalAnalysis_1.LexicalAnalysis(inputString);
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
