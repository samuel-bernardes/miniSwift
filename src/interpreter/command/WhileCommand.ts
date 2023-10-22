import { LanguageException, customErrors } from "../../error/LanguageException";
import { Expr } from "../expr/Expr";
import { BoolType } from "../type/primitive/types/BoolType";
import { Value } from "../value/Value";
import { Command } from "./Command";

class WhileCommand extends Command {

    private expr: Expr;
    private cmds: Command;

    constructor(line: number, expr: Expr, cmds: Command) {
        super(line);
        this.expr = expr;
        this.cmds = cmds;
    }

    public execute(): void {
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
        } while (true);
    }

}
