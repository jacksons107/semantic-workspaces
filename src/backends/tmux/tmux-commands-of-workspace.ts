import { Workspace } from "../../workspace";
import { WorkspaceDiff } from "../../session-diff";
import { TmuxCommand, TMUX_ANCHOR_SESSION } from "./tmux-command";
import { bashCommandOfResource } from "../bash-command-of-resource";

export function tmuxCommandsOfWorkspace(workspace: Workspace): TmuxCommand[] {
  const { name, resources, layout } = workspace;
  const windowAddress = `${TMUX_ANCHOR_SESSION}:${name}`;

  const commands: TmuxCommand[] = [];

  // ensure the shared anchor session exists (fails harmlessly if it already does)
  commands.push({ name: "new-session", flags: ["d", "s"], arg: TMUX_ANCHOR_SESSION });

  // TODO maybe we shouldn't kill the window
  // kill this workspace's window if it exists from a previous run, then start fresh
  commands.push({ name: "kill-window", flags: ["t"], address: windowAddress, arg: "" });
  commands.push({ name: "new-window", flags: ["t", "n"], address: TMUX_ANCHOR_SESSION, arg: name });

  // create a pane for each resource
  for (let i = 1; i < resources.length; i++) {
    commands.push({
      name: "split-window",
      flags: ["t", i % 2 === 1 ? "h" : "v"],
      address: windowAddress,
      arg: "",
    });
  }

  // select a tmux layout
  commands.push({ name: "select-layout", flags: ["t"], address: windowAddress, arg: layout });

  // send any terminal commands to their corresponding processes
  resources.forEach((resource, i) => {
    commands.push({
      name: "send-keys",
      flags: ["t"],
      address: `${windowAddress}.${i}`,
      arg: "",
      bashCommand: bashCommandOfResource(resource),
    });
  });

  return commands;
}

export function tmuxCommandsOfWorkspaceDiff(diff: WorkspaceDiff): TmuxCommand[] {
  if (diff.isNewWorkspace) {
    return tmuxCommandsOfWorkspace(diff.workspace);
  }

  const { name } = diff.workspace;
  const windowAddress = `${TMUX_ANCHOR_SESSION}:${name}`;
  const commands: TmuxCommand[] = [];

  diff.newResources.forEach((resource, offset) => {
    const i = diff.existingResourceCount + offset;

    commands.push({
      name: "split-window",
      flags: ["t", i % 2 === 1 ? "h" : "v"],
      address: windowAddress,
      arg: "",
    });

    commands.push({
      name: "send-keys",
      flags: ["t"],
      address: `${windowAddress}.${i}`,
      arg: "",
      bashCommand: bashCommandOfResource(resource),
    });
  });

  return commands;
}
