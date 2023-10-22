import { Category, Type } from "../Type";
import { TypeException } from "../TypeException";
import { PrimitiveTypes } from "./types";
export abstract class PrimitiveType extends Type {
    protected constructor(classification: Category) {
        super(classification);
    }

    public static instance(classification: Category): PrimitiveType {
        switch (classification) {
            case Category.Bool:
                return PrimitiveTypes.BoolType.instance();
            case Category.Int:
                return PrimitiveTypes.IntType.instance();
            case Category.Float:
                return PrimitiveTypes.FloatType.instance();
            case Category.Char:
                return PrimitiveTypes.CharType.instance();
            case Category.String:
                return PrimitiveTypes.StringType.instance();
            default:
                throw new TypeException;
        }
    }
}
