import { Environment } from "./Environment";
import { Command } from "./command/Command";

export class Interpreter {

    public static globals: Environment;

    static {
        Interpreter.globals = new Environment();
    }

    public static interpret(cmd: Command): void {
        cmd.execute();
    }

}