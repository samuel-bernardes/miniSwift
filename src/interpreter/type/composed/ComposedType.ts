import { Type, Category } from '../Type'; // Substitua './type' pelo caminho correto do seu módulo de tipo
import { TypeException } from '../TypeException';
import { ArrayType } from './ArrayType'; // Substitua './arraytype' pelo caminho correto do seu módulo de ArrayType
import { DictType } from './DictType'; // Substitua './dicttype' pelo caminho correto do seu módulo de DictType

export abstract class ComposedType extends Type {
    protected constructor(classification: Category) {
        super(classification);
    }

    public static instance(classification: Category, innerTypes: Type[]): ComposedType {
        switch (classification) {
            case Category.Array:
                if (innerTypes.length === 1) {
                    return ArrayType.instance(classification, innerTypes);
                }
            case Category.Dict:
                if (innerTypes.length === 2) {
                    return DictType.instance(classification, innerTypes);
                }
            default:
                throw new TypeException;
        }
    }
}
