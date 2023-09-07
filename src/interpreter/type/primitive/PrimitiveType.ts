import { Type, Category } from '../Type'; // Substitua './type' pelo caminho correto do seu módulo de tipo
import { BoolType } from './BoolType';
import { FloatType } from './FloatType';
import { IntType } from './IntType';
import { StringType } from './StringType';
import { CharType } from './CharType';

export abstract class PrimitiveType extends Type {
    protected constructor(classification: Category) {
        super(classification);
    }

    public static instance(classification: Category): PrimitiveType {
        switch (classification) {
            case Category.Bool:
                return BoolType.instance();
            case Category.Int:
                return IntType.instance();
            case Category.Float:
                return FloatType.instance();
            case Category.Char:
                return CharType.instance();
            case Category.String:
                return StringType.instance();
            default:
                throw new Error('TypeException');
        }
    }
}
