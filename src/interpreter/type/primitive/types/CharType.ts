import { Type, Category } from '../../Type'; // Substitua './type' pelo caminho correto do seu módulo de tipo
import { PrimitiveType } from '../PrimitiveType';

export class CharType extends PrimitiveType {
    private static readonly type: CharType = new CharType();

    private constructor() {
        super(Category.Char);
    }

    public match(type: Type): boolean {
        return type === CharType.type;
    }

    public toString(): string {
        return 'Char';
    }

    public static instance(): CharType {
        return CharType.type;
    }
}
