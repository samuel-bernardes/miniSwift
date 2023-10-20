import { Value } from "../value/Value";
import { Expr } from "./Expr";

export class ConstExpr extends Expr {

    private value: Value;

    constructor(line: number, value: Value) {
        super(line);
        this.value = value;
    }

    public expr(): Value {
        return this.value;
    }

}