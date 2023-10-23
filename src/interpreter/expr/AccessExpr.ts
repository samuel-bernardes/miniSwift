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

        if (valueExpr.type.getCategory() == Category.Array) {
            let arrayData = valueExpr.data as Array<Value>;
            if (this.index.expr().type.match(IntType.instance())) {
                if(arrayData.length > Number(this.index.expr().data)){
                    return arrayData[Number(this.index.expr().data)];
                }
                else{
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidOperation);
                }
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, this.index.expr().toString());
            }
        } else if (valueExpr.type.getCategory() == Category.Dict) {
            //TODO k["aa"]
            let dictData = valueExpr.data as Map<Value, Value>;

            let dictValue = dictData.get(this.index.expr());

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
        this.write(value);
    }

    private write(value: Value): void {

        let setBase: Value = this.base.expr();

        if (!setBase.type.match(value.type))
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, value.type.toString());

        if (setBase.type.getCategory() == Category.Array) {
            let arrayData = setBase.data as Array<Value>;
            arrayData[Number(this.index.expr().data)] = value;
        } else if (setBase.type.getCategory() == Category.Dict) {
            let dictData = setBase.data as Map<Value, Value>;
            dictData.set(this.index.expr(), value);
        }

    }
}