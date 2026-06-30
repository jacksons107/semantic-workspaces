import { execSync } from "node:child_process";
import { Workspace } from "./workspace";
import { tmuxCommandsOfWorkspace } from "./tmux-commands-of-workspace";
import { stringOfTmuxCommand } from "./string-of-tmux-command";

export function runWorkspace(workspace: Workspace): void {
    const commands = tmuxCommandsOfWorkspace(workspace);

    for (const cmd of commands) {
        const str = stringOfTmuxCommand(cmd);
        try {
            execSync(str, cmd.name === "kill-session" ? { stdio: "pipe" } : {});
        } catch (e) {
            if (cmd.name !== "kill-session") throw e;
        }
    }
}
