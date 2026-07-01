import { GhosttyCommand } from "./ghostty-command";

function escapeAppleScriptString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function terminalVar(index: number): string {
  return `terminal${index}`;
}

export function stringOfGhosttyCommand(cmd: GhosttyCommand): string {
  switch (cmd.kind) {
    case "new-tab":
      return `set ${terminalVar(cmd.terminalIndex)} to focused terminal of (new tab in front window)`;
    case "split":
      return `set ${terminalVar(cmd.targetIndex)} to split ${terminalVar(cmd.sourceIndex)} direction ${cmd.direction}`;
    case "input-text": {
      const text = escapeAppleScriptString(cmd.text);
      return `input text "${text}" to ${terminalVar(cmd.terminalIndex)}`;
    }
    case "send-key": {
      const key = escapeAppleScriptString(cmd.key);
      return `send key "${key}" to ${terminalVar(cmd.terminalIndex)}`;
    }
  }
}
