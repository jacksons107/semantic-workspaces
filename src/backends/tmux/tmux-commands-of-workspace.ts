import { Workspace } from "../../workspace";
import { WorkspaceDiff } from "../../session-diff";
import { TmuxCommand } from "./tmux-command";
import { bashCommandOfResource } from "../bash-command-of-resource";

export function tmuxCommandsOfWorkspace(workspace: Workspace): TmuxCommand[] {
  const { name, resources, layout } = workspace;
  const sessionAddress = `${name}:0`;

  const commands: TmuxCommand[] = [];

  // TODO maybe we shouldn't kill the session
  // kill old session if it exits, then start a new one
  commands.push({ name: "kill-session", flags: ["t"], address: name, arg: "" });
  commands.push({ name: "new-session", flags: ["d", "s"], arg: name });

  // create a pane for each resource
  for (let i = 1; i < resources.length; i++) {
    commands.push({
      name: "split-window",
      flags: ["t", i % 2 === 1 ? "h" : "v"],
      address: sessionAddress,
      arg: "",
    });
  }

  // select a tmux layout
  commands.push({ name: "select-layout", flags: ["t"], address: sessionAddress, arg: layout });

  // send any terminal commands to their corresponding processes
  resources.forEach((resource, i) => {
    commands.push({
      name: "send-keys",
      flags: ["t"],
      address: `${name}:0.${i}`,
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
  const sessionAddress = `${name}:0`;
  const commands: TmuxCommand[] = [];

  diff.newResources.forEach((resource, offset) => {
    const i = diff.existingResourceCount + offset;

    commands.push({
      name: "split-window",
      flags: ["t", i % 2 === 1 ? "h" : "v"],
      address: sessionAddress,
      arg: "",
    });

    commands.push({
      name: "send-keys",
      flags: ["t"],
      address: `${name}:0.${i}`,
      arg: "",
      bashCommand: bashCommandOfResource(resource),
    });
  });

  return commands;
}
