import { Expr } from "../expr/Expr";
import { Variable } from "../expr/Variable";
import { Value } from "../value/Value";
import { Command } from "./Command";

export class InitializeCommand extends Command {

    private expr: Expr;
    private variable: Variable;

    constructor(line: number, variable: Variable, expr: Expr) {
        super(line);
        this.expr = expr;
        this.variable = variable;
    }

    public execute(): void {
        let value: Value = this.expr.expr();
        this.variable.initialize(value);
    }

}