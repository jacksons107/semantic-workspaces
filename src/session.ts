import {
  Resource,
  Workspace,
  Layout,
  EditorResource,
  Language,
  REPLResource,
  AgentResource,
  Agent,
  DiffResource
} from "./workspace";


export interface Session {
  workspaces: Map<string, Workspace>;
}

export function createSession(): Session {
  return { workspaces: new Map<string, Workspace>() }
}

// TODO maybe convert to JSON instead
export function stringOfSession(session: Session): string {
  const lines: string[] = ["Session:"];
  for (const [, workspace] of session.workspaces) {
    lines.push(`  workspace "${workspace.name}" (${workspace.layout})`);
    for (const resource of workspace.resources) {
      switch (resource.kind) {
        case "editor": lines.push(`    - editor "${resource.name}": ${resource.file}`); break;
        case "repl": lines.push(`    - repl "${resource.name}": ${resource.language}`); break;
        case "agent": lines.push(`    - agent "${resource.name}": ${resource.agent}`); break;
        case "diff": {
          const target = resource.ref || "(working tree)";
          const scope = resource.paths.length > 0 ? ` [${resource.paths.join(", ")}]` : "";
          lines.push(`    - diff "${resource.name}": ${target}${scope}`);
          break;
        }
      }
    }
  }

  return lines.join("\n");
}

function createWorkspace(
  name: string,
  layout: Layout,
  resources: Resource[] | null = null
): Workspace {
  return {
    name: name,
    layout: layout,
    resources: resources ?? [],
  };
}

// Add a new workspace to a session.
export function addNewWorkspace(
  name: string,
  layout: Layout,
  session: Session
): Session {
  const workspace = createWorkspace(name, layout);

  return {
    ...session,
    workspaces: new Map(session.workspaces).set(name, workspace)
  };
}

export function createEditorResource(name: string, file: string): EditorResource {
  return {
    name: name,
    kind: "editor",
    file: file
  };
}

export function createREPLResource(name: string, language: Language): REPLResource {
  return {
    name: name,
    kind: "repl",
    language: language
  };
}

export function createAgentResource(name: string, agent: Agent): AgentResource {
  return {
    name: name,
    kind: "agent",
    agent: agent
  };
}

export function createDiffResource(name: string, ref: string, paths: string[]): DiffResource {
  return {
    name: name,
    kind: "diff",
    ref: ref,
    paths: paths
  };
}

// TODO how to handle errors?
// Add a new resource to a workspace in a session.
export function addResource(workspace: Workspace, resource: Resource, currentSession: Session): Session {

  const newWorkspace = createWorkspace(workspace.name, workspace.layout, [...workspace.resources, resource]);
  return {
    ...currentSession,
    workspaces: new Map(currentSession.workspaces).set(workspace.name, newWorkspace)
  };
}
