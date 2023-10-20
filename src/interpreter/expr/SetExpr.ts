import { Value } from "../value/Value";
import { Expr } from "./Expr";

export abstract class SetExpr extends Expr {

    protected constructor(line: number) {
        super(line);
    }

    public abstract expr(): Value;
    public abstract setValue(value: Value): void;

}