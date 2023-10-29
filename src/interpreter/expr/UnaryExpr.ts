import { LanguageException, customErrors } from "../../error/LanguageException";
import { BoolType } from "../type/primitive/types/BoolType";
import { Value } from "../value/Value";
import { Expr } from "./Expr";

export class UnaryExpr extends Expr {

    private varExpr: Expr;
    private op: Operator;

    constructor(line: number, expr: Expr, op: Operator) {
        super(line);
        this.varExpr = expr;
        this.op = op;
    }

    public expr(): Value {
        let value: Value = this.varExpr.expr();
        let ret: Value;
        switch (this.op) {
            case Operator.Not:
                ret = this.notOp(value);
                break;
            case Operator.Neg:
                ret = this.negOp(value);
                break;
            default:
                throw LanguageException.instance(super.getLine(), customErrors.InvalidOperation);
        }

        return ret;
    }

    private notOp(value: Value): Value {
        let btype: BoolType = BoolType.instance();
        if (btype.match(value.type)) {
            let b: boolean = !Boolean(value.data);
            return new Value(btype, b);
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, value.type.toString());
        }
    }

    private negOp(value: Value): Value {
        let n: number = Number(value.data);
        return new Value(value.type, -n);
    }
}

export enum Operator {
    Not,
    Neg
}