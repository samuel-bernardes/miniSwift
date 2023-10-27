import { Type, Category } from '../Type';
import { TypeException } from '../TypeException';
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
            return this.innerType.match(atype.innerType);
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
            return this.keyType.match(dtype.keyType) && this.valueType.match(dtype.valueType);
        } else {
            return false;
        }
    }

    public toString(): string {
        return `Dict<${this.keyType},${this.valueType}>`;
    }

    public static instance(classification: Category, ...args: Type[]): DictType {
        return new DictType(Category.Dict, args);
    }
}
