import { LanguageException, customErrors } from "../../error/LanguageException";
import { Category } from "../type/Type";
import { DictType } from "../type/composed/ComposedType";
import { Value } from "../value/Value";
import { Expr } from "./Expr";

export class DictExpr extends Expr {

    private items: DictItem[];
    private type: DictType;

    constructor(line: number, type: DictType, items: DictItem[]) { //line : int, type : DictType, items : List<DictItem>
        super(line);
        this.type = type;
        this.items = items;
    }

    public expr(): Value {

        let dictionary = new Map<Value, Value>();

        this.items.forEach(item => {
            // Adiciona cada item do tipo DictItem ao dicionário
            let keyData = item.key.expr();
            let valueData = item.value.expr();
            if (keyData.type.match(this.type.getKeyType()) && valueData.type.match(this.type.getValueType())) {
                dictionary.set(keyData, valueData);
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, keyData.type.toString() + "-" + valueData.type.toString());
            }

        });

        let value: Value = new Value(DictType.instance(Category.Dict, this.type.getKeyType(), this.type.getValueType()), dictionary);

        return value;
    }

}

export interface DictItem {
    key: Expr;
    value: Expr;
}
