import { LanguageException, customErrors } from "../../error/LanguageException";
import { Expr } from "../expr/Expr";
import { Variable } from "../expr/Variable";
import { Category } from "../type/Type";
import { BoolType } from "../type/primitive/types/BoolType";
import { Value } from "../value/Value";
import { Command } from "./Command";

export class ForCommand extends Command {

    private expr: Expr;
    private variable: Variable;
    private cmds: Command;

    constructor(line: number, expr: Expr, cmds: Command, variable: Variable) {
        super(line);
        this.variable = variable;
        this.expr = expr;
        this.cmds = cmds;
    }

    //for let c : Char in word

    public execute(): void {

        /* let value: Value = this.expr.expr();
        let arrayType: ArrayType = ArrayType.instance(Category.Array, value.type);

        if (arrayType.match(value.type)) {
            valuiee
        }

        do {
            let value: Value = this.expr.expr();
            let boolType: BoolType = BoolType.instance();
            if (boolType.match(value.type)) {
                let b: boolean = Boolean(value.data);
                if (!b)
                    break;

                this.cmds.execute();
            } else {
                throw LanguageException.instance(super.getLine(), customErrors["Tipo inválido"], value.type.toString());
            }
        } while (true); */
    }

}
