import { Value } from "../value/Value";
import { Expr } from "./Expr";

export class ConditionalExpr extends Expr {

    private cond: Expr;
    private trueExpr: Expr;
    private falseExpr: Expr;

    constructor(line: number, cond: Expr, trueExpr: Expr, falseExpr: Expr) {
        super(line);
        this.cond = cond;
        this.trueExpr = trueExpr;
        this.falseExpr = falseExpr;
    }

    public expr(): Value {
        let condExprValue: boolean = Boolean(this.cond.expr().data);

        if (condExprValue) {
            return this.trueExpr.expr();
        } else {
            return this.falseExpr.expr();
        }
    }

}
