import { Type, Category } from '../Type'; // Substitua './type' pelo caminho correto do seu módulo de tipo
import { PrimitiveType } from './PrimitiveType';

export class BoolType extends PrimitiveType {
    private static readonly type: BoolType = new BoolType();

    private constructor() {
        super(Category.Bool);
    }

    public match(type: Type): boolean {
        return type === BoolType.type;
    }

    public toString(): string {
        return 'Bool';
    }

    public static instance(): BoolType {
        return BoolType.type;
    }
}
