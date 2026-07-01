import { execSync, execFileSync } from "node:child_process";
import { Workspace } from "./workspace";
import { Session } from "./session";
import { tmuxCommandsOfWorkspace } from "./backends/tmux/tmux-commands-of-workspace";
import { stringOfTmuxCommand } from "./backends/tmux/string-of-tmux-command";
import { ghosttyCommandsOfWorkspace } from "./backends/ghostty/ghostty-commands-of-workspace";
import { stringOfGhosttyCommand } from "./backends/ghostty/string-of-ghostty-command";

export function runWorkspaceTmux(workspace: Workspace): void {
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

export function runWorkspaceGhostty(workspace: Workspace): void {
  const statements = ghosttyCommandsOfWorkspace(workspace).map(stringOfGhosttyCommand);

  const script = [
    `tell application "Ghostty"`,
    `if (count of windows) is 0 then make new window`,
    ...statements,
    `end tell`,
  ];

  const args = script.flatMap(line => ["-e", line]);
  execFileSync("osascript", args);
}

export function runSession(session: Session, runWorkspace: (arg: Workspace) => void): void {
  for (const [_, workspace] of session.workspaces) {
    runWorkspace(workspace);
  }
}
