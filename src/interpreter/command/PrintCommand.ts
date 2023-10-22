import { Expr } from "../expr/Expr";
import { Value } from "../value/Value";
import { Command } from "./Command";

export class PrintCommand extends Command {

    private expr: Expr;
    private newline: boolean;

    constructor(line: number, expr: Expr, newline: boolean) {
        super(line);
        this.expr = expr;
        this.newline = newline;
    }

    public execute(): void {
        let value: Value = this.expr.expr();
        if (this.newline)
            console.log(value.data);
        else 
            process.stdout.write("" + value.data);
    }

}