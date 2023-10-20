import { LanguageException, customErrors } from "../error/LanguageException";
import { Token } from "../lexical/Token";
import { Variable } from "./expr/Variable";
import { Type } from "./type/Type";

export class Environment {

    private enclosing: Environment | undefined;
    private memory: { [key: string]: Variable; } = {};

    constructor(enclosing?: Environment) {
        if (enclosing) {
            this.enclosing = enclosing;
        }
    }

    public declare(name: Token, type: Type, constant: boolean): Variable {
        if (this.memory[name.lexeme]) {

            throw LanguageException.instance(name.line, customErrors.AlreadyDeclaredVariable, name.lexeme);
        }

        let variable = new Variable(name, type, constant);
        this.memory[name.lexeme] = variable;

        return variable;
    }

    public get(name: Token): Variable {
        if (this.memory[name.lexeme])
            return this.memory[name.lexeme];

        if (this.enclosing != null)
            return this.enclosing.get(name);

        throw LanguageException.instance(name.line, customErrors.UndeclaredVariable, name.lexeme);
    }

}

