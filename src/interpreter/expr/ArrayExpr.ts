import { Value } from "../value/Value";
import { ActionOperator } from "./ActionExpr";
import { Expr } from "./Expr";

export class ArrayExpr extends Expr {

    private op: ActionOperator;

    constructor(line: number, op: ActionOperator) {
        super(line);
        this.op = op;
    }

    public expr(): Value {
        throw new Error;
    }

}
