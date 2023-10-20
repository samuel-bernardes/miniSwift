import { Command } from "./Command";

export class BlocksCommand extends Command {
    public execute(): void {
        this.cmds.forEach((cmd: Command) => cmd.execute());
    }

    private cmds: Command[];

    constructor(line: number, cmds: Command[]) {
        super(line);
        this.cmds = cmds;
    }

}