import { LanguageException, customErrors } from "../../error/LanguageException";
import { Category } from "../type/Type";
import { ArrayType } from "../type/composed/ComposedType";
import { BoolType } from "../type/primitive/types/BoolType";
import { IntType } from "../type/primitive/types/IntType";
import { StringType } from "../type/primitive/types/StringType";
import { Value } from "../value/Value";
import { Expr } from "./Expr";

export class FunctionExpr extends Expr {

    private op: FuncOp;
    private exprBase: Expr;
    private param: Expr | undefined;

    constructor(line: number, op: FuncOp, expr: Expr, param?: Expr) { //(line : int, op : FunctionOp, expr : Expr : arg : Expr = nul
        super(line);
        this.op = op;
        this.exprBase = expr;
        this.param = param;
    }

    public expr(): Value {
        switch (this.op) {
            case FuncOp.Count:
                if (this.exprBase.expr().type.match(StringType.instance()) || (this.exprBase.expr().type.getCategory() == Category.Array)) {
                    let valueExp = this.exprBase.expr().data as string | Array<any>;
                    return new Value(IntType.instance(), Number(valueExp.length));
                } else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidType, this.exprBase.expr().toString());
                }
            case FuncOp.Empty:
                if (this.exprBase.expr().type.match(StringType.instance()) || (this.exprBase.expr().type.getCategory() == Category.Array)) {
                    let valueExp = this.exprBase.expr().data as string | Array<any>;
                    return new Value(BoolType.instance(), Boolean(valueExp.length == 0));
                } else if (this.exprBase.expr().type.getCategory() == Category.Dict) {
                    let valueExp = this.exprBase.expr().data as Map<Value, Value>;
                    return new Value(BoolType.instance(), Boolean(valueExp.size == 0));
                } else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidType, this.exprBase.expr().toString());
                }
            case FuncOp.Keys:
                if (this.exprBase.expr().type.getCategory() == Category.Dict) {
                    let valueExp = this.exprBase.expr().data as Map<Value, Value>;

                    let keysArray = Array.from(valueExp.keys());

                    let keyType = keysArray[0].type;

                    let keysValue = keysArray.map((key) => {
                        return key.data;
                    })

                    return new Value(ArrayType.instance(Category.Array, keyType), keysValue);
                } else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidType, this.exprBase.expr().toString());
                }
            case FuncOp.Values:
                if (this.exprBase.expr().type.getCategory() == Category.Dict) {
                    let valueExp = this.exprBase.expr().data as Map<Value, Value>;

                    let valuesArray = Array.from(valueExp.values());

                    let valueType = valuesArray[0].type;

                    let values = valuesArray.map((key) => {
                        return key.data;
                    })

                    return new Value(ArrayType.instance(Category.Array, valueType), values);
                } else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidType, this.exprBase.expr().toString());
                }
            case FuncOp.Append:
                if (this.param) {
                    if ((this.exprBase.expr().type.getCategory() == Category.Array)) {
                        let valueExp = this.exprBase.expr().data as Array<Value>;

                        return new Value(ArrayType.instance(Category.Array, valueExp[0].type), valueExp.push(this.param.expr()));
                    } else {
                        throw LanguageException.instance(super.getLine(), customErrors.InvalidType, this.exprBase.expr().toString());
                    }
                }
            case FuncOp.Contains:
                if (this.param) {
                    if ((this.exprBase.expr().type.getCategory() == Category.Array)) {
                        let valueExp = this.exprBase.expr().data as Array<Value>;

                        return new Value(BoolType.instance(), Boolean(valueExp.includes(this.param.expr())));
                    } else {
                        throw LanguageException.instance(super.getLine(), customErrors.InvalidType, this.exprBase.expr().toString());
                    }
                }
            default:
                throw LanguageException.instance(super.getLine(), customErrors.InvalidOperation);
        }
    }


}

export enum FuncOp {
    Count,
    Empty,
    Keys,
    Values,
    Append,
    Contains
}
