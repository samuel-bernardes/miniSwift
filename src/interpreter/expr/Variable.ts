import { LanguageException } from "../../error/LanguageException";
import { Token } from "../../lexical/Token";
import { Type } from "../type/Type";
import { Value } from "../value/Value";
import { SetExpr } from "./SetExpr";
import { customErrors } from "../../error/LanguageException";

export class Variable extends SetExpr {

    private name: string;
    private type: Type;
    private constant: boolean;
    private value: Value | null;

    constructor(name: Token, type: Type, constant: boolean) {
        super(name.line);

        this.name = name.lexeme;
        this.type = type;
        this.constant = constant;
        this.value = null;
    }

    public getName(): String {
        return this.name;
    }

    public getType(): Type {
        return this.type;
    }

    public isConstant(): boolean {
        return this.constant;
    }

    public initialize(value: Value): void {
        this.write(value, true);
    }

    public expr(): Value {
        if (this.value == null)
            throw LanguageException.instance(super.getLine(), customErrors.UndeclaredVariable, this.name);

        return this.value;
    }

    public setValue(value: Value): void {
        this.write(value, false);
    }

    private write(value: Value, initialize: boolean): void {
        if (!initialize && this.isConstant())
            throw LanguageException.instance(super.getLine(), customErrors.ConstantAssignment, this.name);

        if (!this.type.match(value.type))
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, value.type.toString());

        this.value = value;
    }

}
