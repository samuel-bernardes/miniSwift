import { Type, Category } from '../../Type';  // Substitua './type' pelo caminho correto do seu módulo de tipo
import { PrimitiveType } from '../PrimitiveType';

export class IntType extends PrimitiveType {
    private static readonly type: IntType = new IntType();

    private constructor() {
        super(Category.Int);
    }

    public match(type: Type): boolean {
        return type === IntType.type;
    }

    public toString(): string {
        return 'Int';
    }

    public static instance(): IntType {
        return IntType.type;
    }
}
