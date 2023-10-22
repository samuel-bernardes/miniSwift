import { LanguageException, customErrors } from "../../error/LanguageException";
import { Category, Type } from "../type/Type";
import { ArrayType } from "../type/composed/ArrayType";
import { Value } from "../value/Value";
import { Expr } from "./Expr";

export class ArrayExpr extends Expr {

    private items: Expr[];
    private innerType: Type;

    constructor(line: number, innerType: Type, items: Expr[]) { //line : int, type : ArrayType, items : List<Expr>
        super(line);
        this.items = items;
        this.innerType = innerType;
    }

    public expr(): Value {

        let listItems: Value[] = [];

        this.items.forEach(item => {
            let itemExpr: Value = item.expr();
            if (this.innerType.match(itemExpr.type)) {
                listItems.push(itemExpr);
            } else {
                throw LanguageException.instance(super.getLine(), customErrors["Tipo inválido"], itemExpr.type.toString());
            }
        })

        let value: Value = new Value(ArrayType.instance(Category.Array, this.innerType), listItems);

        return value;
    }

}
