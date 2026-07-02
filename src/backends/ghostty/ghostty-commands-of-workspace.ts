import { Workspace } from "../../workspace";
import { WorkspaceDiff } from "../../session-diff";
import { GhosttyCommand, GhosttyTerminalRef } from "./ghostty-command";
import { bashCommandOfResource } from "../bash-command-of-resource";

export function ghosttyCommandsOfWorkspace(workspace: Workspace): GhosttyCommand[] {
  const { resources } = workspace;

  const commands: GhosttyCommand[] = [];

  commands.push({ kind: "new-tab", localIndex: 0 });

  resources.forEach((resource, i) => {
    if (i > 0) {
      commands.push({
        kind: "split",
        source: { kind: "new", localIndex: i - 1 },
        targetLocalIndex: i,
        direction: i % 2 === 1 ? "right" : "down",
      });
    }
    const terminal: GhosttyTerminalRef = { kind: "new", localIndex: i };
    commands.push({ kind: "input-text", terminal, text: bashCommandOfResource(resource) });
    commands.push({ kind: "send-key", terminal, key: "enter" });
  });

  return commands;
}

export function ghosttyCommandsOfWorkspaceDiff(diff: WorkspaceDiff, existingTerminalIds: string[]): GhosttyCommand[] {
  if (diff.isNewWorkspace) {
    return ghosttyCommandsOfWorkspace(diff.workspace);
  }

  const lastExistingTerminalId = existingTerminalIds[existingTerminalIds.length - 1];
  if (diff.newResources.length > 0 && lastExistingTerminalId === undefined) {
    throw new Error(`Cannot diff workspace "${diff.workspace.name}": no existing terminal id to split from.`);
  }

  const commands: GhosttyCommand[] = [];

  diff.newResources.forEach((resource, offset) => {
    const targetLocalIndex = offset;

    const source: GhosttyTerminalRef =
      offset === 0
        ? { kind: "existing", id: lastExistingTerminalId! }
        : { kind: "new", localIndex: offset - 1 };

    commands.push({
      kind: "split",
      source,
      targetLocalIndex,
      direction: (diff.existingResourceCount + offset) % 2 === 1 ? "right" : "down",
    });

    const terminal: GhosttyTerminalRef = { kind: "new", localIndex: targetLocalIndex };
    commands.push({ kind: "input-text", terminal, text: bashCommandOfResource(resource) });
    commands.push({ kind: "send-key", terminal, key: "enter" });
  });

  return commands;
}
