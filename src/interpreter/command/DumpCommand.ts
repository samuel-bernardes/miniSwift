import { Expr } from "../expr/Expr";
import { Value } from "../value/Value";
import { Command } from "./Command";

export class DumpCommand extends Command {

    private expr: Expr;

    constructor(line: number, expr: Expr) {
        super(line);
        this.expr = expr;
    }

    public execute(): void {
        let value: Value = this.expr.expr();
        console.log(value);
    }

}