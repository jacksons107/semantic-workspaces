
export interface Session {
    workspaces: Workspace[];
}

export interface Workspace {
    name: string;
    layout: Layout;
    resources: Resource[];
}

export type Layout = 
    | "tiled"

export type Resource = 
    | EditorResource
    | REPLResource
    | AgentResource

interface BasicResource {
    kind: string
    id: number
}

export interface EditorResource extends BasicResource {
    kind: "editor";
    file: string
}

export type Language =
    | "typescript"
    | "python"

export interface REPLResource extends BasicResource {
    kind: "repl";
    language: Language
}

export type Agent =
    | "claude"
    | "codex"

export interface AgentResource extends BasicResource {
    kind: "agent";
    agent: Agent;
}
