import { LanguageException, customErrors } from "../../error/LanguageException";
import { Expr } from "../expr/Expr";
import { BoolType } from "../type/primitive/types/BoolType";
import { Value } from "../value/Value";
import { Command } from "./Command";

export class IfCommand extends Command {

    private expr: Expr;
    private cmds: Command;
    private elseCmd: Command | undefined;

    constructor(line: number, expr: Expr, cmds: Command, elseCmd?: Command) {
        super(line);
        this.expr = expr;
        this.cmds = cmds;
        this.elseCmd = elseCmd;
    }

    public execute(): void {
        let value: Value = this.expr.expr();
        let boolType: BoolType = BoolType.instance();
        if (boolType.match(value.type)) {
            let b: boolean = Boolean(value.data);
            if (b) {
                this.cmds.execute();
            }
            else if (this.elseCmd) {
                this.elseCmd.execute();
            }
        } else {
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, value.type.toString());
        }

    }

}