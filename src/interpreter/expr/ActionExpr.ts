import { LanguageException, customErrors } from "../../error/LanguageException";
import { FloatType } from "../type/primitive/types/FloatType";
import { StringType } from "../type/primitive/types/StringType";
import { Value } from "../value/Value";
import { Expr } from "./Expr";

const readline = require('readline');

/*const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function enterData(): string {
    return rl.question('', (input: string) => {
        return input;
    });
}*/

function randomFloat() {
    return Math.random();
}

export class ActionExpr extends Expr {

    private op: ActionOperator;

    constructor(line: number, op: ActionOperator) {
        super(line);
        this.op = op;
    }

    public expr(): Value {
        switch (this.op) {
            case ActionOperator.Read:
                return new Value(StringType.instance(), console.log());
            case ActionOperator.Random:
                throw new Value(FloatType.instance(), randomFloat());;
            default:
                throw LanguageException.instance(super.getLine(), customErrors.InvalidOperation);
        }
    }
}

export enum ActionOperator {
    Read,
    Random
}
