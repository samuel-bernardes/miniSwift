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
            process.stdout.write(value.data + "\n");
        else 
            process.stdout.write("" + value.data);
    }

}