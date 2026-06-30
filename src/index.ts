import { Workspace } from "./workspace";
import { tmuxCommandsOfWorkspace } from "./tmux-commands-of-workspace";
import { runWorkspace } from "./run-workspace";

const workspace: Workspace = {
    name: "mvp",
    layout: "tiled",
    resources: [
        {
            kind: "editor",
            id: 0,
            file: "/Users/jacksonslipock/Desktop/artifact-ui/server.py"
        },
        {
            kind: "repl",
            id: 1,
            language: "python"
        },
        {
            kind: "editor",
            id: 2,
            file: "/Users/jacksonslipock/Desktop/artifact-ui/system_spec/render.py"
        }
    ]
};

runWorkspace(workspace);
