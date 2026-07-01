import { describe, it, expect } from "vitest";
import { ghosttyCommandsOfWorkspace } from "../src/backends/ghostty/ghostty-commands-of-workspace";
import { Workspace } from "../src/workspace";

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
          "terminalIndex": 0,
        },
        {
          "kind": "input-text",
          "terminalIndex": 0,
          "text": "nvim src/parser.ts",
        },
        {
          "key": "enter",
          "kind": "send-key",
          "terminalIndex": 0,
        },
        {
          "direction": "right",
          "kind": "split",
          "sourceIndex": 0,
          "targetIndex": 1,
        },
        {
          "kind": "input-text",
          "terminalIndex": 1,
          "text": "python3",
        },
        {
          "key": "enter",
          "kind": "send-key",
          "terminalIndex": 1,
        },
        {
          "direction": "down",
          "kind": "split",
          "sourceIndex": 1,
          "targetIndex": 2,
        },
        {
          "kind": "input-text",
          "terminalIndex": 2,
          "text": "claude",
        },
        {
          "key": "enter",
          "kind": "send-key",
          "terminalIndex": 2,
        },
      ]
    `);
  });
});
