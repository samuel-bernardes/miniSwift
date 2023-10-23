import { Expr } from "../expr/Expr";
import { SetExpr } from "../expr/SetExpr";
import { Value } from "../value/Value";
import { Command } from "./Command";

export class AssignCommand extends Command {

    private rhs: Expr;
    private lhs: SetExpr;

    constructor(line: number, rhs: Expr, lhs: SetExpr) {
        super(line);
        this.rhs = rhs;
        this.lhs = lhs;
    }

    public execute(): void {
        let v: Value = this.rhs.expr();
        if (this.lhs != null) this.lhs.setValue(v);
    }

}