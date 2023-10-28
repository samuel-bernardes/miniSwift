import { LanguageException, customErrors } from "../../error/LanguageException";
import { Category } from "../type/Type";
import { IntType } from "../type/primitive/types/IntType";
import { Value } from "../value/Value";
import { Expr } from "./Expr";
import { SetExpr } from "./SetExpr";

export class AccessExpr extends SetExpr {

    private base: SetExpr;
    private index: Expr;

    constructor(line: number, base: SetExpr, index: Expr) { //(line : int, base : SetExpr, index : Expr
        super(line);
        this.base = base;
        this.index = index;
    }

    public expr(): Value {
        let valueExpr: Value = this.base.expr();
        let indexExpr: Value = this.index.expr();
        let indexExprData: number = Number(indexExpr.data);
        if (valueExpr.type.getCategory() == Category.Array) {
            let arrayData = valueExpr.data as Array<Value>;
            if (indexExpr.type.match(IntType.instance())) {
                if (indexExprData >= 0 && indexExprData < arrayData.length) {
                    return arrayData[indexExprData];
                }
                else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidOperation);
                }
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, this.index.expr().toString());
            }
        } else if (valueExpr.type.getCategory() == Category.Dict) {
            let dictData = valueExpr.data as Map<Value, Value>;
            let dictValue: Value | undefined;

            for (const key of dictData.keys()) {
                if (key.type.match(indexExpr.type) && key.data === indexExpr.data) {
                    dictValue = dictData.get(key);
                    break;
                }
            }

            if (dictValue) {
                return dictValue;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidOperation);
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidOperation);
        }

    }

    public setValue(value: Value): void {
        let valueExpr: Value = this.base.expr();
        let indexExpr: Value = this.index.expr();
        let indexExprData: number = Number(indexExpr.data);

        if (valueExpr.type.getCategory() == Category.Array) {
            let arrayData = valueExpr.data as Array<Value>;
            if (indexExpr.type.match(IntType.instance())) {
                if (arrayData.length > indexExprData) {
                    arrayData[indexExprData] = value;
                }
                else {
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidOperation);
                }
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, this.index.expr().toString());
            }
        } else if (valueExpr.type.getCategory() == Category.Dict) {
            //TODO k["aa"]
            let dictData = valueExpr.data as Map<Value, Value>;
            let dictValue: Value | undefined;

            for (const values of dictData.values()) {
                if (!values.type.match(value.type)) throw LanguageException.instance(super.getLine(), customErrors.InvalidType, value.toString());;
            }

            for (const key of dictData.keys()) {
                if (key.type.match(indexExpr.type) && key.data === indexExpr.data) {
                    dictValue = key;
                    dictData.set(key, value);
                }
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidOperation);
        }
    }
}