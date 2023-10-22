import { Type, Category } from '../Type'; // Substitua './type' pelo caminho correto do seu módulo de tipo
import { ComposedType } from './ComposedType';

export class ArrayType extends ComposedType {
    private innerType: Type;

    private constructor(innerType: Type) {
        super(Category.Array);
        this.innerType = innerType;
    }

    public getInnerType(): Type {
        return this.innerType;
    }

    public match(type: Type): boolean {
        if (type instanceof ArrayType) {
            const atype = type as ArrayType;
            return this.innerType === atype.innerType;
        } else {
            return false;
        }
    }

    public hashCode(str: string): number {
        var h: number = 0;
        for (var i = 0; i < str.length; i++) {
            h = 31 * h + str.charCodeAt(i);
        }
        return h & 0xFFFFFFFF
    }

    public equals(obj: unknown): boolean {
        if (this === obj) {
            return true;
        } else if (obj instanceof ArrayType) {
            return this.match(obj);
        } else {
            return false;
        }
    }

    public toString(): string {
        return `Array<${this.innerType}>`;
    }

    public static instance(classification: Category, innerType: Type): ArrayType {
        return new ArrayType(innerType);
    }
}
