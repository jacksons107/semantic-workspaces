import { execSync, execFileSync } from "node:child_process";
import { WorkspaceDiff } from "./session-diff";
import { tmuxCommandsOfWorkspaceDiff } from "./backends/tmux/tmux-commands-of-workspace";
import { stringOfTmuxCommand } from "./backends/tmux/string-of-tmux-command";
import { ghosttyCommandsOfWorkspaceDiff } from "./backends/ghostty/ghostty-commands-of-workspace";
import { stringOfGhosttyCommand } from "./backends/ghostty/string-of-ghostty-command";
import { stringOfTmuxControlCommand } from "./backends/tmux-control/string-of-tmux-control-command";
import { TmuxControlConnection } from "./backends/tmux-control/tmux-control-connection";

// These commands are expected to fail in ordinary operation: kill-session/kill-window
// reset a workspace that may not exist yet, and new-session bootstraps the shared
// anchor session idempotently (it fails once the anchor already exists).
function isIdempotentCommand(name: string): boolean {
  return name === "kill-session" || name === "kill-window" || name === "new-session";
}

export function runWorkspaceDiffTmux(diff: WorkspaceDiff): void {
  const commands = tmuxCommandsOfWorkspaceDiff(diff);

  for (const cmd of commands) {
    const str = stringOfTmuxCommand(cmd);
    try {
      execSync(str, isIdempotentCommand(cmd.name) ? { stdio: "pipe" } : {});
    } catch (e) {
      if (!isIdempotentCommand(cmd.name)) throw e;
    }
  }
}

export async function runWorkspaceDiffTmuxControl(diff: WorkspaceDiff, connection: TmuxControlConnection): Promise<void> {
  const commands = tmuxCommandsOfWorkspaceDiff(diff);

  for (const cmd of commands) {
    const line = stringOfTmuxControlCommand(cmd);
    const result = await connection.sendCommand(line);
    if (!result.ok && !isIdempotentCommand(cmd.name)) {
      throw new Error(`tmux control command failed: ${line}\n${result.lines.join("\n")}`);
    }
  }
}

export function runWorkspaceDiffGhostty(diff: WorkspaceDiff, existingTerminalIds: string[]): string[] {
  const commands = ghosttyCommandsOfWorkspaceDiff(diff, existingTerminalIds);
  const statements = commands.map(stringOfGhosttyCommand);

  const newLocalIndices = commands
    .filter(cmd => cmd.kind === "new-tab" || cmd.kind === "split")
    .map(cmd => cmd.kind === "new-tab" ? cmd.localIndex : cmd.targetLocalIndex);

  const idExprs = newLocalIndices.map(i => `(id of terminal${i})`);
  const returnStatement = idExprs.length > 0 ? `return ${idExprs.join(' & "|" & ')}` : `return ""`;

  const script = [
    `tell application "Ghostty"`,
    `if (count of windows) is 0 then make new window`,
    ...statements,
    returnStatement,
    `end tell`,
  ];

  const args = script.flatMap(line => ["-e", line]);
  const output = execFileSync("osascript", args, { encoding: "utf-8" }).trim();
  const newIds = output === "" ? [] : output.split("|");

  return [...existingTerminalIds, ...newIds];
}
