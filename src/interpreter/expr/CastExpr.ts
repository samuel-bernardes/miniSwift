import { InternalException } from "../../error/InternalException";
import { Category } from "../type/Type";
import { BoolType } from "../type/primitive/types/BoolType";
import { CharType } from "../type/primitive/types/CharType";
import { FloatType } from "../type/primitive/types/FloatType";
import { IntType } from "../type/primitive/types/IntType";
import { StringType } from "../type/primitive/types/StringType";
import { Value } from "../value/Value";
import { Expr } from "./Expr";

export class CastExpr extends Expr {

    private op: CastOperator;
    private varExpr: Expr;

    constructor(line: number, op: CastOperator, expr: Expr) {
        super(line);
        this.op = op;
        this.varExpr = expr;
    }

    public expr(): Value {

        let localExpr = this.varExpr.expr();

        switch (this.op) {
            case CastOperator.toBoolOp:
                if (localExpr.type.getCategory() === Category.Dict) {
                    let exprData = localExpr.data as Map<Value, Value>;
                    if (exprData.size == 0) {
                        return new Value(BoolType.instance(), false);
                    } else {
                        return new Value(BoolType.instance(), true);
                    }
                } else if (localExpr.type.getCategory() === Category.Array) {
                    let exprData = localExpr.data as Array<Value>;
                    if (exprData.length == 0) {
                        return new Value(BoolType.instance(), false);
                    } else {
                        return new Value(BoolType.instance(), true);
                    }
                } else {
                    return new Value(BoolType.instance(), Boolean(localExpr.data));
                }
            case CastOperator.toIntOp:
                if (localExpr.type.match(IntType.instance()) || localExpr.type.match(FloatType.instance())) {
                    return new Value(IntType.instance(), parseInt(String(localExpr.data)));
                } else if (localExpr.type.match(CharType.instance())) {

                    let localExprData = localExpr.data as string;

                    return new Value(IntType.instance(), localExprData == '0' ? 0 : Number(localExprData.charCodeAt(0)));
                } else {
                    return new Value(IntType.instance(), 0);
                }

            case CastOperator.toFloatOp:

                if (localExpr.type.match(IntType.instance()) || localExpr.type.match(FloatType.instance())) {
                    return new Value(FloatType.instance(), parseFloat(String(localExpr.data)));
                } else if (localExpr.type.match(CharType.instance())) {
                    let localExprData = localExpr.data as string;

                    return new Value(FloatType.instance(), localExprData == '0' ? 0.0 : parseFloat(String(localExprData.charCodeAt(0))));
                } else {
                    return new Value(FloatType.instance(), 0.0);
                }
            case CastOperator.toCharOp:

                if (localExpr.type.match(IntType.instance()) || localExpr.type.match(CharType.instance())) {
                    return new Value(CharType.instance(), String.fromCharCode(Number(localExpr.data)));
                } else {
                    return new Value(CharType.instance(), '\0');
                }
            case CastOperator.toStringOp:
                return new Value(StringType.instance(), String(localExpr.data));

            default:
                throw new InternalException("unreachable");
        }
    }

}

export enum CastOperator {
    toBoolOp,
    toIntOp,
    toFloatOp,
    toCharOp,
    toStringOp
}