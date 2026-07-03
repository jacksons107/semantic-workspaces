import { describe, it, expect } from "vitest";
import { stringOfTmuxControlCommand } from "../src/backends/tmux-control/string-of-tmux-control-command";

describe("stringOfTmuxControlCommand", () => {
  it("kill-session", () => {
    expect(stringOfTmuxControlCommand({
      name: "kill-session", flags: ["t"], address: "mvp", arg: ""
    })).toMatchInlineSnapshot(`"kill-session -t mvp"`);
  });

  it("new-session", () => {
    expect(stringOfTmuxControlCommand({
      name: "new-session", flags: ["d", "s"], arg: "mvp"
    })).toMatchInlineSnapshot(`"new-session -d -s mvp"`);
  });

  it("new-session for the shared anchor session", () => {
    expect(stringOfTmuxControlCommand({
      name: "new-session", flags: ["d", "s"], arg: "semantic-workspaces"
    })).toMatchInlineSnapshot(`"new-session -d -s semantic-workspaces"`);
  });

  it("kill-window", () => {
    expect(stringOfTmuxControlCommand({
      name: "kill-window", flags: ["t"], address: "semantic-workspaces:mvp", arg: ""
    })).toMatchInlineSnapshot(`"kill-window -t semantic-workspaces:mvp"`);
  });

  it("new-window", () => {
    expect(stringOfTmuxControlCommand({
      name: "new-window", flags: ["t", "n"], address: "semantic-workspaces", arg: "mvp"
    })).toMatchInlineSnapshot(`"new-window -t semantic-workspaces -n mvp"`);
  });

  it("split-window horizontal", () => {
    expect(stringOfTmuxControlCommand({
      name: "split-window", flags: ["t", "h"], address: "mvp:0", arg: ""
    })).toMatchInlineSnapshot(`"split-window -t mvp:0 -h"`);
  });

  it("split-window vertical", () => {
    expect(stringOfTmuxControlCommand({
      name: "split-window", flags: ["t", "v"], address: "mvp:0", arg: ""
    })).toMatchInlineSnapshot(`"split-window -t mvp:0 -v"`);
  });

  it("select-layout", () => {
    expect(stringOfTmuxControlCommand({
      name: "select-layout", flags: ["t"], address: "mvp:0", arg: "tiled"
    })).toMatchInlineSnapshot(`"select-layout -t mvp:0 tiled"`);
  });

  it("send-keys", () => {
    expect(stringOfTmuxControlCommand({
      name: "send-keys", flags: ["t"], address: "mvp:0.0", arg: "",
      bashCommand: "nvim src/foo.ts"
    })).toMatchInlineSnapshot(`"send-keys -t mvp:0.0 "nvim src/foo.ts" Enter"`);
  });
});
