import { Type, Category } from '../Type';
import { ComposedType } from './ComposedType';

export class DictType extends ComposedType {
    private keyType: Type;
    private valueType: Type;

    private constructor(classification: Category, innerTypes: Type[]) {
        super(Category.Dict);
        this.keyType = innerTypes[0];
        this.valueType = innerTypes[1];
    }

    public getKeyType(): Type {
        return this.keyType;
    }

    public getValueType(): Type {
        return this.valueType;
    }

    public match(type: Type): boolean {
        if (type instanceof DictType) {
            const dtype = type as DictType;
            return this.keyType === dtype.keyType && this.valueType === dtype.valueType;
        } else {
            return false;
        }
    }

    /* public hashCode(): number {
        const prime = 31;
        let result = super.hashCode();
        result = prime * result + this.keyType.hashCode();
        result = prime * result + this.valueType.hashCode();
        return result;
    } */

    public equals(obj: any): boolean {
        if (this === obj) {
            return true;
        } else if (obj instanceof DictType) {
            return this.match(obj);
        } else {
            return false;
        }
    }

    public toString(): string {
        return `Dict<${this.keyType},${this.valueType}>`;
    }

    public static instance(classification: Category, innerTypes: Type[]): DictType {
        return new DictType(classification,innerTypes);
    }
}
