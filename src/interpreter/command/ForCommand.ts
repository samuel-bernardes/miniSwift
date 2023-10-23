import { LanguageException, customErrors } from "../../error/LanguageException";
import { Expr } from "../expr/Expr";
import { Variable } from "../expr/Variable";
import { Category } from "../type/Type";
import { BoolType } from "../type/primitive/types/BoolType";
import { CharType } from "../type/primitive/types/CharType";
import { Value } from "../value/Value";
import { Command } from "./Command";
import { InitializeCommand } from "./InitializeCommand";

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
        let value = this.expr.expr();
        if(value.type.getCategory() == Category.Array){
            let listItems: Value[] = value.data as Value[];
            listItems.forEach(item => {
                if(this.variable.getType() == item.type){
                    this.variable.initialize(item);
                    this.cmds.execute();
                }
                else{
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidType, this.variable.getType().toString()); 
                }
            });
        }
        else if (value.type.getCategory() == Category.String){
            let str: String = value.data as String;
            for (let i = 0; i < str.length; i++) {
                let value: Value = new Value(CharType.instance(), str.charAt(i));
                if(this.variable.getType() == CharType.instance()){
                    this.variable.initialize(value);
                    this.cmds.execute();
                }
                else{
                    throw LanguageException.instance(super.getLine(), customErrors.InvalidType, this.variable.getType().toString()); 
                } 
            }
        }
        else{
            throw LanguageException.instance(super.getLine(), customErrors.InvalidType, value.type.toString());
        }
    }

}
