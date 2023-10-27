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

    constructor(line: number, op: FuncOp, expr: Expr, param?: Expr) {
        super(line);
        this.op = op;
        this.exprBase = expr;
        this.param = param;
    }

    public expr(): Value {
        let expr: Value = this.exprBase.expr();
        switch (this.op) {
            case FuncOp.Count:
                if (expr.type.match(StringType.instance()) || (expr.type.getCategory() == Category.Array)) {
                    let valueExp = expr.data as string | Array<unknown>;
                    return new Value(IntType.instance(), Number(valueExp.length));
                } else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidType, expr.toString());
                }
            case FuncOp.Empty:
                if (expr.type.match(StringType.instance()) || (expr.type.getCategory() == Category.Array)) {
                    let valueExp = expr.data as string | Array<unknown>;
                    return new Value(BoolType.instance(), Boolean(valueExp.length == 0));
                } else if (expr.type.getCategory() == Category.Dict) {
                    let valueExp = expr.data as Map<Value, Value>;
                    return new Value(BoolType.instance(), Boolean(valueExp.size == 0));
                } else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidType, expr.toString());
                }
            case FuncOp.Keys:
                if (expr.type.getCategory() == Category.Dict) {
                    let valueExp = expr.data as Map<Value, Value>;

                    let keysArray = Array.from(valueExp.keys());

                    let keyType = keysArray[0].type;

                    return new Value(ArrayType.instance(Category.Array, keyType), keysArray);
                } else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidType, expr.toString());
                }
            case FuncOp.Values:
                if (expr.type.getCategory() == Category.Dict) {
                    let valueExp = expr.data as Map<Value, Value>;

                    let valuesArray = Array.from(valueExp.values());

                    let valueType = valuesArray[0].type;

                    return new Value(ArrayType.instance(Category.Array, valueType), valuesArray);
                } else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidType, expr.toString());
                }
            case FuncOp.Append:
                if (this.param) {
                    if ((expr.type.getCategory() == Category.Array)) {
                        let valueExp = expr.data as Array<Value>;
                        let newValue = this.param.expr();
                        valueExp.push(newValue);
                        if (newValue.type.match(valueExp[0].type)) {
                            return new Value(ArrayType.instance(Category.Array, valueExp[0].type), valueExp);
                        } else {
                            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, expr.toString());
                        }
                    } else {
                        throw LanguageException.instance(super.getLine(), customErrors.InvalidType, expr.toString());
                    }
                } else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidType, expr.toString());
                }
            case FuncOp.Contains:
                if (this.param) {
                    if ((expr.type.getCategory() == Category.Array)) {
                        let valueExpr = expr.data as Array<Value>;

                        let paramExpr = this.param.expr();

                        let hasElement: boolean = false;

                        valueExpr.forEach(value => {
                            if (value.data == paramExpr.data && value.type.match(paramExpr.type)) {
                                hasElement = true;
                            }
                        })

                        return new Value(BoolType.instance(), Boolean(hasElement));
                    } else {
                        throw LanguageException.instance(super.getLine(), customErrors.InvalidType, expr.toString());
                    }
                } else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidOperation);
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
