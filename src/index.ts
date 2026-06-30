import { Workspace, Session } from "./workspace";
import { runSession } from "./run-workspace";

const workspace1: Workspace = {
    name: "mvp1",
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

const workspace2: Workspace = {
    name: "mvp2",
    layout: "tiled",
    resources: [
        {
            kind: "editor",
            id: 0,
            file: "/Users/jacksonslipock/Desktop/artifact-ui/restart.sh"
        },
        {
            kind: "agent",
            id: 1,
            agent: "claude"
        }
    ]
}

const workspace3: Workspace = {
    name: "mvp3",
    layout: "tiled",
    resources: [
        {
            kind: "editor",
            id: 0,
            file: "/Users/jacksonslipock/Desktop/artifact-ui/README.md"
        }
    ]
}

const workspaces: Workspace[] = [workspace1, workspace2, workspace3];
const session: Session = {
    workspaces: workspaces
};

runSession(session);
