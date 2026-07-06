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
  | DiffResource

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

export interface DiffResource extends BasicResource {
  kind: "diff";
  ref: string;     // e.g. "main", "HEAD~3", or "" for working tree vs HEAD
  paths: string[]; // e.g. ["src/foo.ts"], or [] for the whole repo
}
