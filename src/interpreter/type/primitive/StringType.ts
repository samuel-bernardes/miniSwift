import { Type, Category } from '../Type'; // Substitua './type' pelo caminho correto do seu módulo de tipo
import { PrimitiveType } from './PrimitiveType';

export class StringType extends PrimitiveType {
    private static readonly type: StringType = new StringType();

    private constructor() {
        super(Category.String);
    }

    public match(type: Type): boolean {
        return type === StringType.type;
    }

    public toString(): string {
        return 'String';
    }

    public static instance(): StringType {
        return StringType.type;
    }
}
