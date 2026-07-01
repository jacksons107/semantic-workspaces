import { describe, it, expect } from "vitest";
import { tmuxCommandsOfWorkspace } from "../src/backends/tmux/tmux-commands-of-workspace";
import { Workspace } from "../src/workspace";

describe("tmuxCommandsOfWorkspace", () => {
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

    expect(tmuxCommandsOfWorkspace(workspace)).toMatchInlineSnapshot(`
      [
        {
          "address": "parser",
          "arg": "",
          "flags": [
            "t",
          ],
          "name": "kill-session",
        },
        {
          "arg": "parser",
          "flags": [
            "d",
            "s",
          ],
          "name": "new-session",
        },
        {
          "address": "parser:0",
          "arg": "",
          "flags": [
            "t",
            "h",
          ],
          "name": "split-window",
        },
        {
          "address": "parser:0",
          "arg": "",
          "flags": [
            "t",
            "v",
          ],
          "name": "split-window",
        },
        {
          "address": "parser:0",
          "arg": "tiled",
          "flags": [
            "t",
          ],
          "name": "select-layout",
        },
        {
          "address": "parser:0.0",
          "arg": "",
          "bashCommand": "nvim src/parser.ts",
          "flags": [
            "t",
          ],
          "name": "send-keys",
        },
        {
          "address": "parser:0.1",
          "arg": "",
          "bashCommand": "python3",
          "flags": [
            "t",
          ],
          "name": "send-keys",
        },
        {
          "address": "parser:0.2",
          "arg": "",
          "bashCommand": "claude",
          "flags": [
            "t",
          ],
          "name": "send-keys",
        },
      ]
    `);
  });
});
