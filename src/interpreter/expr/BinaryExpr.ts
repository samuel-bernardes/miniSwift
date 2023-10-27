import { InternalException } from "../../error/InternalException";
import { LanguageException, customErrors } from "../../error/LanguageException";
import { Category } from "../type/Type";
import { ArrayType } from "../type/composed/ComposedType";
import { BoolType } from "../type/primitive/types/BoolType";
import { CharType } from "../type/primitive/types/CharType";
import { FloatType } from "../type/primitive/types/FloatType";
import { IntType } from "../type/primitive/types/IntType";
import { StringType } from "../type/primitive/types/StringType";
import { Value } from "../value/Value";
import { Expr } from "./Expr";
export class BinaryExpr extends Expr {
    private left: Expr;
    private op: BinaryOperator;
    private right: Expr;

    constructor(line: number, left: Expr, op: BinaryOperator, right: Expr) {
        super(line);
        this.left = left;
        this.op = op;
        this.right = right;
    }

    public expr(): Value {
        let lvalue: Value = this.left.expr();
        let rvalue: Value = this.right.expr();

        let ret: Value;
        switch (this.op) {
            case BinaryOperator.And:
                ret = this.andOp(lvalue, rvalue);
                break;
            case BinaryOperator.Or:
                ret = this.orOp(lvalue, rvalue);
                break;
            case BinaryOperator.Equal:
                ret = this.equalOp(lvalue, rvalue);
                break;
            case BinaryOperator.NotEqual:
                ret = this.notEqualOp(lvalue, rvalue);
                break;
            case BinaryOperator.LowerThan:
                ret = this.lowerThanOp(lvalue, rvalue);
                break;
            case BinaryOperator.LowerEqual:
                ret = this.lowerEqualOp(lvalue, rvalue);
                break;
            case BinaryOperator.GreaterThan:
                ret = this.greaterThanOp(lvalue, rvalue);
                break;
            case BinaryOperator.GreaterEqual:
                ret = this.greaterEqualOp(lvalue, rvalue);
                break;
            case BinaryOperator.Add:
                ret = this.addOp(lvalue, rvalue);
                break;
            case BinaryOperator.Sub:
                ret = this.subOp(lvalue, rvalue);
                break;
            case BinaryOperator.Mul:
                ret = this.mulOp(lvalue, rvalue);
                break;
            case BinaryOperator.Div:
                ret = this.divOp(lvalue, rvalue);
                break;
            default:
                throw new InternalException("unreachable");
        }

        return ret;
    }

    private andOp(lvalue: Value, rvalue: Value): Value {
        let boolType: BoolType = BoolType.instance();
        if (boolType.match(lvalue.type)) {
            if (boolType.match(rvalue.type)) {
                let m: boolean = Boolean(lvalue.data);
                let n: boolean = Boolean(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m && n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

    private orOp(lvalue: Value, rvalue: Value): Value {
        let boolType: BoolType = BoolType.instance();
        if (boolType.match(lvalue.type)) {
            if (boolType.match(rvalue.type)) {
                let m: boolean = Boolean(lvalue.data);
                let n: boolean = Boolean(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m || n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

    private equalOp(lvalue: Value, rvalue: Value): Value {
        if (lvalue.type == rvalue.type) {
            let v: Value = new Value(BoolType.instance(), (lvalue.data === rvalue.data));
            return v;
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

    private notEqualOp(lvalue: Value, rvalue: Value): Value {
        if (lvalue.type == rvalue.type) {
            let v: Value = new Value(BoolType.instance(), (lvalue.data != rvalue.data));
            return v;
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

    private lowerThanOp(lvalue: Value, rvalue: Value): Value {
        let intType: IntType = IntType.instance();
        let floatType: FloatType = FloatType.instance();
        let charType: CharType = CharType.instance();
        let stringType: StringType = StringType.instance();

        if (intType.match(lvalue.type)) {
            if (intType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m < n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (floatType.match(lvalue.type)) {
            if (floatType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m < n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (charType.match(lvalue.type)) {
            if (charType.match(rvalue.type)) {
                let m: string = String(lvalue.data);
                let n: string = String(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m < n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (stringType.match(lvalue.type)) {
            if (stringType.match(rvalue.type)) {
                let m: string = String(lvalue.data);
                let n: string = String(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m < n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

    private lowerEqualOp(lvalue: Value, rvalue: Value): Value {
        let intType: IntType = IntType.instance();
        let floatType: FloatType = FloatType.instance();
        let charType: CharType = CharType.instance();
        let stringType: StringType = StringType.instance();

        if (intType.match(lvalue.type)) {
            if (intType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m <= n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (floatType.match(lvalue.type)) {
            if (floatType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m <= n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (charType.match(lvalue.type)) {
            if (charType.match(rvalue.type)) {
                let m: string = String(lvalue.data);
                let n: string = String(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m <= n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (stringType.match(lvalue.type)) {
            if (stringType.match(rvalue.type)) {
                let m: string = String(lvalue.data);
                let n: string = String(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m <= n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

    private greaterThanOp(lvalue: Value, rvalue: Value): Value {
        let intType: IntType = IntType.instance();
        let floatType: FloatType = FloatType.instance();
        let charType: CharType = CharType.instance();
        let stringType: StringType = StringType.instance();

        if (intType.match(lvalue.type)) {
            if (intType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m > n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (floatType.match(lvalue.type)) {
            if (floatType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m > n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (charType.match(lvalue.type)) {
            if (charType.match(rvalue.type)) {
                let m: string = String(lvalue.data);
                let n: string = String(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m > n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (stringType.match(lvalue.type)) {
            if (stringType.match(rvalue.type)) {
                let m: string = String(lvalue.data);
                let n: string = String(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m > n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

    private greaterEqualOp(lvalue: Value, rvalue: Value): Value {
        let intType: IntType = IntType.instance();
        let floatType: FloatType = FloatType.instance();
        let charType: CharType = CharType.instance();
        let stringType: StringType = StringType.instance();

        if (intType.match(lvalue.type)) {
            if (intType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m >= n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (floatType.match(lvalue.type)) {
            if (floatType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m >= n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (charType.match(lvalue.type)) {
            if (charType.match(rvalue.type)) {
                let m: string = String(lvalue.data);
                let n: string = String(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m >= n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (stringType.match(lvalue.type)) {
            if (stringType.match(rvalue.type)) {
                let m: string = String(lvalue.data);
                let n: string = String(rvalue.data);
                let v: Value = new Value(BoolType.instance(), (m >= n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

    private addOp(lvalue: Value, rvalue: Value): Value {
        let intType: IntType = IntType.instance();
        let floatType: FloatType = FloatType.instance();
        let charType: CharType = CharType.instance();
        let stringType: StringType = StringType.instance();

        if (intType.match(lvalue.type)) {
            if (intType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(intType, (m + n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (floatType.match(lvalue.type)) {
            if (floatType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);

                let v: Value = new Value(floatType, (m + n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (stringType.match(lvalue.type)) {
            if (stringType.match(rvalue.type)) {
                let m: string = String(lvalue.data);
                let n: string = String(rvalue.data);

                let v: Value = new Value(stringType, (`${m + n}`));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (charType.match(lvalue.type)) {
            if (charType.match(rvalue.type)) {
                let m: string = String(lvalue.data);
                let n: string = String(rvalue.data);

                let v: Value = new Value(charType, Number(m + n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (lvalue.type.getCategory() == Category.Array) {
            if (rvalue.type.match(lvalue.type)) {

                let v: unknown = [...lvalue.data as Array<Value>, ...rvalue.data as Array<Value>,]

                return new Value(ArrayType.instance(Category.Array, lvalue.type), v);
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }

        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

    private subOp(lvalue: Value, rvalue: Value): Value {
        let intType: IntType = IntType.instance();
        let floatType: FloatType = FloatType.instance();
        if (intType.match(lvalue.type)) {
            if (intType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(intType, (m - n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (floatType.match(lvalue.type)) {
            if (floatType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);

                let v: Value = new Value(floatType, (m - n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

    private mulOp(lvalue: Value, rvalue: Value): Value {
        let intType: IntType = IntType.instance();
        let floatType: FloatType = FloatType.instance();
        if (intType.match(lvalue.type)) {
            if (intType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(intType, (m * n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (floatType.match(lvalue.type)) {
            if (floatType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);

                let v: Value = new Value(floatType, (m * n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

    private divOp(lvalue: Value, rvalue: Value): Value {
        let intType: IntType = IntType.instance();
        let floatType: FloatType = FloatType.instance();
        if (intType.match(lvalue.type)) {
            if (intType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);
                let v: Value = new Value(intType, (m / n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else if (floatType.match(lvalue.type)) {
            if (floatType.match(rvalue.type)) {
                let m: number = Number(lvalue.data);
                let n: number = Number(rvalue.data);

                let v: Value = new Value(floatType, (m / n));
                return v;
            } else {
                throw LanguageException.instance(super.getLine(), customErrors.InvalidType, rvalue.type.toString());
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, lvalue.type.toString());
        }
    }

}

export enum BinaryOperator {
    And,
    Or,
    Equal,
    NotEqual,
    LowerThan,
    LowerEqual,
    GreaterThan,
    GreaterEqual,
    Add,
    Sub,
    Mul,
    Div
}