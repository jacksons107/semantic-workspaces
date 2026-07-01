import { Workspace } from "../../workspace";
import { GhosttyCommand } from "./ghostty-command";
import { bashCommandOfResource } from "../bash-command-of-resource";

export function ghosttyCommandsOfWorkspace(workspace: Workspace): GhosttyCommand[] {
  const { resources } = workspace;

  const commands: GhosttyCommand[] = [];

  commands.push({ kind: "new-tab", terminalIndex: 0 });

  resources.forEach((resource, i) => {
    if (i > 0) {
      commands.push({ kind: "split", sourceIndex: i - 1, targetIndex: i, direction: i % 2 === 1 ? "right" : "down" });
    }
    commands.push({ kind: "input-text", terminalIndex: i, text: bashCommandOfResource(resource) });
    commands.push({ kind: "send-key", terminalIndex: i, key: "enter" });
  });

  return commands;
}
