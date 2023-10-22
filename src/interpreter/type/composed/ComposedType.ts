import { Type, Category } from '../Type'; // Substitua './type' pelo caminho correto do seu módulo de tipo
import { TypeException } from '../TypeException';
import { ArrayType } from './ArrayType'; // Substitua './arraytype' pelo caminho correto do seu módulo de ArrayType
import { DictType } from './DictType'; // Substitua './dicttype' pelo caminho correto do seu módulo de DictType

export abstract class ComposedType extends Type {

    protected constructor(classification: Category) {
        super(classification);
    }

    public static instance(classification: Category, ...args: Type[]): ComposedType {
        switch (classification) {
            case Category.Array:
                if (args.length === 1) {
                    return ArrayType.instance(classification, args[0]);
                }
            case Category.Dict:
                if (args.length === 2) {
                    return DictType.instance(classification, args[0], args[1]);
                }
            default:
                throw new TypeException;
        }
    }
}
