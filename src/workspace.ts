export interface Workspace {
  name: string;
  layout: Layout;
  resources: Resource[];
}

export const LAYOUTS = ["tiled"] as const;
export type Layout = typeof LAYOUTS[number];

export type Resource =
  | EditorResource
  | REPLResource
  | AgentResource

interface BasicResource {
  kind: string
  name: string
}

export interface EditorResource extends BasicResource {
  kind: "editor";
  file: string
}

export const LANGUAGES = ["typescript", "python"] as const;
export type Language = typeof LANGUAGES[number];

export interface REPLResource extends BasicResource {
  kind: "repl";
  language: Language
}

export const AGENTS = ["claude", "codex"] as const;
export type Agent = typeof AGENTS[number];

export interface AgentResource extends BasicResource {
  kind: "agent";
  agent: Agent;
}
