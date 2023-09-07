import { Type, Category } from '../Type'; // Substitua './type' pelo caminho correto do seu módulo de tipo
import { PrimitiveType } from './PrimitiveType';

export class FloatType extends PrimitiveType {
    private static readonly type: FloatType = new FloatType();

    private constructor() {
        super(Category.Float);
    }

    public match(type: Type): boolean {
        return type === FloatType.type;
    }

    public toString(): string {
        return 'Float';
    }

    public static instance(): FloatType {
        return FloatType.type;
    }
}
