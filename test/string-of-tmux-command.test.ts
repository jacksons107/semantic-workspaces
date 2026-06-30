import { describe, it, expect } from "vitest";
import { stringOfTmuxCommand } from "../src/string-of-tmux-command";

describe("stringOfTmuxCommand", () => {
    it("kill-session", () => {
        expect(stringOfTmuxCommand({
            name: "kill-session", flags: ["t"], address: "mvp", arg: ""
        })).toMatchInlineSnapshot(`"tmux kill-session -t mvp"`);
    });

    it("new-session", () => {
        expect(stringOfTmuxCommand({
            name: "new-session", flags: ["d", "s"], arg: "mvp"
        })).toMatchInlineSnapshot(`"tmux new-session -d -s mvp"`);
    });

    it("split-window horizontal", () => {
        expect(stringOfTmuxCommand({
            name: "split-window", flags: ["t", "h"], address: "mvp:0", arg: ""
        })).toMatchInlineSnapshot(`"tmux split-window -t mvp:0 -h"`);
    });

    it("split-window vertical", () => {
        expect(stringOfTmuxCommand({
            name: "split-window", flags: ["t", "v"], address: "mvp:0", arg: ""
        })).toMatchInlineSnapshot(`"tmux split-window -t mvp:0 -v"`);
    });

    it("select-layout", () => {
        expect(stringOfTmuxCommand({
            name: "select-layout", flags: ["t"], address: "mvp:0", arg: "tiled"
        })).toMatchInlineSnapshot(`"tmux select-layout -t mvp:0 tiled"`);
    });

    it("send-keys", () => {
        expect(stringOfTmuxCommand({
            name: "send-keys", flags: ["t"], address: "mvp:0.0", arg: "",
            bashCommand: "nvim src/foo.ts"
        })).toMatchInlineSnapshot(`"tmux send-keys -t mvp:0.0 "nvim src/foo.ts" Enter"`);
    });
});
