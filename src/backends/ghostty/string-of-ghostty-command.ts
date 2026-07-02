import { GhosttyCommand, GhosttyTerminalRef } from "./ghostty-command";

function escapeAppleScriptString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function terminalVar(localIndex: number): string {
  return `terminal${localIndex}`;
}

function stringOfTerminalRef(ref: GhosttyTerminalRef): string {
  switch (ref.kind) {
    case "new": return terminalVar(ref.localIndex);
    case "existing": return `terminal id "${escapeAppleScriptString(ref.id)}" of front window`;
  }
}

export function stringOfGhosttyCommand(cmd: GhosttyCommand): string {
  switch (cmd.kind) {
    case "new-tab":
      return `set ${terminalVar(cmd.localIndex)} to focused terminal of (new tab in front window)`;
    case "split":
      return `set ${terminalVar(cmd.targetLocalIndex)} to split ${stringOfTerminalRef(cmd.source)} direction ${cmd.direction}`;
    case "input-text": {
      const text = escapeAppleScriptString(cmd.text);
      return `input text "${text}" to ${stringOfTerminalRef(cmd.terminal)}`;
    }
    case "send-key": {
      const key = escapeAppleScriptString(cmd.key);
      return `send key "${key}" to ${stringOfTerminalRef(cmd.terminal)}`;
    }
  }
}
