
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
