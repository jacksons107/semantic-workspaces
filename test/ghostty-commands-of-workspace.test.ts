import { describe, it, expect } from "vitest";
import { ghosttyCommandsOfWorkspace, ghosttyCommandsOfWorkspaceDiff } from "../src/backends/ghostty/ghostty-commands-of-workspace";
import { Workspace } from "../src/workspace";
import { WorkspaceDiff } from "../src/session-diff";

describe("ghosttyCommandsOfWorkspace", () => {
  it("workspace with an editor, a repl, and an agent", () => {
    const workspace: Workspace = {
      name: "parser",
      layout: "tiled",
      resources: [
        { kind: "editor", name: "e1", file: "src/parser.ts" },
        { kind: "repl", name: "r1", language: "python" },
        { kind: "agent", name: "a1", agent: "claude" },
      ],
    };

    expect(ghosttyCommandsOfWorkspace(workspace)).toMatchInlineSnapshot(`
      [
        {
          "kind": "new-tab",
          "localIndex": 0,
        },
        {
          "kind": "input-text",
          "terminal": {
            "kind": "new",
            "localIndex": 0,
          },
          "text": "nvim src/parser.ts",
        },
        {
          "key": "enter",
          "kind": "send-key",
          "terminal": {
            "kind": "new",
            "localIndex": 0,
          },
        },
        {
          "direction": "right",
          "kind": "split",
          "source": {
            "kind": "new",
            "localIndex": 0,
          },
          "targetLocalIndex": 1,
        },
        {
          "kind": "input-text",
          "terminal": {
            "kind": "new",
            "localIndex": 1,
          },
          "text": "python3",
        },
        {
          "key": "enter",
          "kind": "send-key",
          "terminal": {
            "kind": "new",
            "localIndex": 1,
          },
        },
        {
          "direction": "down",
          "kind": "split",
          "source": {
            "kind": "new",
            "localIndex": 1,
          },
          "targetLocalIndex": 2,
        },
        {
          "kind": "input-text",
          "terminal": {
            "kind": "new",
            "localIndex": 2,
          },
          "text": "claude",
        },
        {
          "key": "enter",
          "kind": "send-key",
          "terminal": {
            "kind": "new",
            "localIndex": 2,
          },
        },
      ]
    `);
  });
});

describe("ghosttyCommandsOfWorkspaceDiff", () => {
  it("new workspace behaves the same as ghosttyCommandsOfWorkspace", () => {
    const workspace: Workspace = {
      name: "parser",
      layout: "tiled",
      resources: [
        { kind: "editor", name: "e1", file: "src/parser.ts" },
      ],
    };
    const diff: WorkspaceDiff = {
      workspace,
      isNewWorkspace: true,
      newResources: workspace.resources,
      existingResourceCount: 0,
    };

    expect(ghosttyCommandsOfWorkspaceDiff(diff, [])).toMatchInlineSnapshot(`
      [
        {
          "kind": "new-tab",
          "localIndex": 0,
        },
        {
          "kind": "input-text",
          "terminal": {
            "kind": "new",
            "localIndex": 0,
          },
          "text": "nvim src/parser.ts",
        },
        {
          "key": "enter",
          "kind": "send-key",
          "terminal": {
            "kind": "new",
            "localIndex": 0,
          },
        },
      ]
    `);
  });

  it("existing workspace with one new resource splits off the last existing terminal by id", () => {
    const workspace: Workspace = {
      name: "parser",
      layout: "tiled",
      resources: [
        { kind: "editor", name: "e1", file: "src/parser.ts" },
        { kind: "repl", name: "r1", language: "python" },
      ],
    };
    const diff: WorkspaceDiff = {
      workspace,
      isNewWorkspace: false,
      newResources: [{ kind: "repl", name: "r1", language: "python" }],
      existingResourceCount: 1,
    };

    expect(ghosttyCommandsOfWorkspaceDiff(diff, ["EXISTING-TERMINAL-ID"])).toMatchInlineSnapshot(`
      [
        {
          "direction": "right",
          "kind": "split",
          "source": {
            "id": "EXISTING-TERMINAL-ID",
            "kind": "existing",
          },
          "targetLocalIndex": 0,
        },
        {
          "kind": "input-text",
          "terminal": {
            "kind": "new",
            "localIndex": 0,
          },
          "text": "python3",
        },
        {
          "key": "enter",
          "kind": "send-key",
          "terminal": {
            "kind": "new",
            "localIndex": 0,
          },
        },
      ]
    `);
  });

  it("existing workspace with two new resources chains splits off the newly created ones", () => {
    const workspace: Workspace = {
      name: "parser",
      layout: "tiled",
      resources: [
        { kind: "editor", name: "e1", file: "src/parser.ts" },
        { kind: "repl", name: "r1", language: "python" },
        { kind: "agent", name: "a1", agent: "claude" },
      ],
    };
    const diff: WorkspaceDiff = {
      workspace,
      isNewWorkspace: false,
      newResources: [
        { kind: "repl", name: "r1", language: "python" },
        { kind: "agent", name: "a1", agent: "claude" },
      ],
      existingResourceCount: 1,
    };

    expect(ghosttyCommandsOfWorkspaceDiff(diff, ["EXISTING-TERMINAL-ID"])).toMatchInlineSnapshot(`
      [
        {
          "direction": "right",
          "kind": "split",
          "source": {
            "id": "EXISTING-TERMINAL-ID",
            "kind": "existing",
          },
          "targetLocalIndex": 0,
        },
        {
          "kind": "input-text",
          "terminal": {
            "kind": "new",
            "localIndex": 0,
          },
          "text": "python3",
        },
        {
          "key": "enter",
          "kind": "send-key",
          "terminal": {
            "kind": "new",
            "localIndex": 0,
          },
        },
        {
          "direction": "down",
          "kind": "split",
          "source": {
            "kind": "new",
            "localIndex": 0,
          },
          "targetLocalIndex": 1,
        },
        {
          "kind": "input-text",
          "terminal": {
            "kind": "new",
            "localIndex": 1,
          },
          "text": "claude",
        },
        {
          "key": "enter",
          "kind": "send-key",
          "terminal": {
            "kind": "new",
            "localIndex": 1,
          },
        },
      ]
    `);
  });
});
