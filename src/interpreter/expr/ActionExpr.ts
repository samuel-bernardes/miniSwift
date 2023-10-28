import { LanguageException, customErrors } from "../../error/LanguageException";
import { FloatType } from "../type/primitive/types/FloatType";
import { StringType } from "../type/primitive/types/StringType";
import { Value } from "../value/Value";
import { Expr } from "./Expr";

const readlineSync = require('readline-sync');

function randomFloat(): number {
    return Math.random();
}

function readStringFromUser() {
    const userInput = readlineSync.question('');
    return userInput;
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
                let input = readStringFromUser();

                return new Value(StringType.instance(), String(input));

            case ActionOperator.Random:
                return new Value(FloatType.instance(), randomFloat());

            default:
                throw LanguageException.instance(super.getLine(), customErrors.InvalidOperation);
        }
    }
}

export enum ActionOperator {
    Read,
    Random
}