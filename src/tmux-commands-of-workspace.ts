import { Resource, Workspace } from "./workspace";
import { TmuxCommand } from "./tmux-command";

export function tmuxCommandsOfWorkspace(workspace: Workspace): TmuxCommand[] {
    const { name, resources, layout } = workspace;
    const sessionAddress = `${name}:0`;

    const commands: TmuxCommand[] = [];

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

function bashCommandOfResource(resource: Resource): string {
    switch (resource.kind) {
        case "editor":
            return `nvim ${resource.file}`;
        case "repl":
            switch (resource.language) {
                case "typescript": return "npx ts-node";
                case "python":     return "python3";
            }
        case "agent":
            switch (resource.agent) {
                case "claude": return "claude";
                case "codex": return "codex";
            }
    }
}
