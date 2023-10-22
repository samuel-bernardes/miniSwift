import { FloatType } from "../type/primitive/types/FloatType";
import { StringType } from "../type/primitive/types/StringType";
import { Value } from "../value/Value";
import { Expr } from "./Expr";

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function enterData(): string {
    return rl.question('', (input: string) => {
        return input;
    });
}

function randomFloat() {
    return Math.random();
}

class ActionExpr extends Expr {

    private op: ActionOperator;

    constructor(line: number, op: ActionOperator) {
        super(line);
        this.op = op;
    }

    public expr(): Value {
        switch (this.op) {
            case ActionOperator.Read:
                return new Value(StringType.instance(), enterData().trim());
            case ActionOperator.Random:
                throw new Value(FloatType.instance(), randomFloat());;
            default:
                throw new Error;
        }
    }

}

export enum ActionOperator {
    Read,
    Random
}
