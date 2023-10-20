import { Value } from "../value/Value";

export abstract class Expr {

    private line: number;

    protected constructor(line: number) {
        this.line = line;
    }

    public getLine(): number {
        return this.line;
    }

    public abstract expr(): Value;

}