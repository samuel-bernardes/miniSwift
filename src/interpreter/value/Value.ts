import { InternalException } from "../../error/InternalException";
import { Type, Category } from "../type/Type";

export class Value {
    public readonly type: Type;
    public readonly data: unknown;
    
    constructor(type: Type, data: unknown) {
        switch (type.getCategory()) {
            case Category.Bool:
                if (typeof data !== 'boolean') {
                    throw new Error('Valor de tipo incorreto para Bool');
                }
                break;
            case Category.Int:
                if (typeof data !== 'number' || !Number.isInteger(data)) {
                    throw new Error('Valor de tipo incorreto para Int');
                }
                break;
            case Category.Float:
                if (typeof data !== 'number') {
                    throw new Error('Valor de tipo incorreto para Float');
                }
                break;
            case Category.Char:
                if (typeof data !== 'string' || data.length !== 1) {
                    throw new Error('Valor de tipo incorreto para Char');
                }
                break;
            case Category.String:
                if (typeof data !== 'string') {
                    throw new Error('Valor de tipo incorreto para String');
                }
                break;
            case Category.Array:
                if (!Array.isArray(data)) {
                    throw new Error('Valor de tipo incorreto para Array');
                }
                break;
            case Category.Dict:
                if (!(typeof data === 'object' && !Array.isArray(data))) {
                    throw new Error('Valor de tipo incorreto para Dict');
                }
                break;
            default:
                throw new InternalException('Unrecheable');
        }

        this.type = type;
        this.data = data;
    }

    toString(): string {
        return `${this.type.toString()}(${this.data})`;
    }
}
