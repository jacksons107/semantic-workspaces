import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createSession, addNewWorkspace, addResource, createEditorResource, createREPLResource, createAgentResource, Session, stringOfSession } from "./session";
import { runWorkspaceDiffGhostty } from "./run-session";
import { diffSession } from "./session-diff";
import { LAYOUTS, LANGUAGES, AGENTS, Workspace } from "./workspace";

let lastRunSession: Session | null = null;
const ghosttyTerminalIds = new Map<string, string[]>();

type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string }

function getWorkspace(workspaceName: string, session: Session): Result<Workspace> {
  const workspace = session.workspaces.get(workspaceName);

  if (!workspace) {
    return { ok: false, error: `Workspace named ${workspaceName} does not exist in this sesison.` };
  }

  return { ok: true, value: workspace };
}


let session: Session = createSession();

const server = new McpServer({
  name: "semantic-workspaces",
  version: "0.1.0",
});

server.registerTool("create_session", {
  description: "Reset to a new empty session, discarding any previous state.",
}, () => {
  session = createSession();
  return { content: [{ type: "text", text: "Session created." }] };
});

server.registerTool("add_workspace", {
  description: "Add a new workspace to the session.",
  inputSchema: z.object({
    name: z.string().describe("Unique name for the workspace (becomes the tmux session name)"),
    layout: z.enum(LAYOUTS).describe("Tmux layout for the panes"),
  }),
}, ({ name, layout }) => {
  session = addNewWorkspace(name, layout, session);
  return { content: [{ type: "text", text: `Workspace "${name}" added.` }] };
});

server.registerTool("add_editor", {
  description: "Add an editor pane (nvim) to a workspace.",
  inputSchema: z.object({
    workspaceName: z.string().describe("Name of the workspace to add the editor to"),
    name: z.string().describe("Unique name for this resource"),
    file: z.string().describe("Absolute path to the file to open"),
  }),
}, ({ workspaceName, name, file }) => {
  const workspace: Result<Workspace> = getWorkspace(workspaceName, session);

  if (!workspace.ok) {
    return { content: [{ type: "text", text: workspace.error }] };
  }

  session = addResource(workspace.value, createEditorResource(name, file), session);
  return { content: [{ type: "text", text: `Editor "${name}" added to workspace "${workspaceName}".` }] };
});

server.registerTool("add_repl", {
  description: "Add a REPL pane to a workspace.",
  inputSchema: z.object({
    workspaceName: z.string().describe("Name of the workspace to add the REPL to"),
    name: z.string().describe("Unique name for this resource"),
    language: z.enum(LANGUAGES).describe("Language for the REPL"),
  }),
}, ({ workspaceName, name, language }) => {
  const workspace: Result<Workspace> = getWorkspace(workspaceName, session);

  if (!workspace.ok) {
    return { content: [{ type: "text", text: workspace.error }] };
  }

  session = addResource(workspace.value, createREPLResource(name, language), session);
  return { content: [{ type: "text", text: `REPL "${name}" (${language}) added to workspace "${workspaceName}".` }] };
});

server.registerTool("add_agent", {
  description: "Add an AI agent pane to a workspace.",
  inputSchema: z.object({
    workspaceName: z.string().describe("Name of the workspace to add the agent to"),
    name: z.string().describe("Unique name for this resource"),
    agent: z.enum(AGENTS).describe("Which agent to run"),
  }),
}, ({ workspaceName, name, agent }) => {
  const workspace: Result<Workspace> = getWorkspace(workspaceName, session);

  if (!workspace.ok) {
    return { content: [{ type: "text", text: workspace.error }] };
  }

  session = addResource(workspace.value, createAgentResource(name, agent), session);
  return { content: [{ type: "text", text: `Agent "${name}" (${agent}) added to workspace "${workspaceName}".` }] };
});

server.registerTool("get_session", {
  description: "Return a readable summary of the current session state.",
}, () => {
  if (session.workspaces.size === 0) {
    return { content: [{ type: "text", text: "Session is empty. No workspaces configured." }] };
  }

  const sessionString = stringOfSession(session);

  return { content: [{ type: "text", text: sessionString }] };
});

server.registerTool("run_session", {
  description: "Render the session in Ghostty, only creating what's new since the last run.",
}, () => {
  const names = [...session.workspaces.keys()];
  if (names.length === 0) {
    return { content: [{ type: "text", text: "No workspaces to run. Call add_workspace first." }] };
  }

  const diffs = diffSession(lastRunSession, session);

  for (const diff of diffs) {
    const existingIds = ghosttyTerminalIds.get(diff.workspace.name) ?? [];
    const updatedIds = runWorkspaceDiffGhostty(diff, existingIds);
    ghosttyTerminalIds.set(diff.workspace.name, updatedIds);
  }

  lastRunSession = session;

  return {
    content: [{
      type: "text",
      text: `Rendered ${names.length} workspace(s): ${names.join(", ")}.`,
    }],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
