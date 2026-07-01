import { describe, it, expect } from "vitest";
import { stringOfGhosttyCommand } from "../src/backends/ghostty/string-of-ghostty-command";

describe("stringOfGhosttyCommand", () => {
  it("new-tab", () => {
    expect(stringOfGhosttyCommand({
      kind: "new-tab", terminalIndex: 0
    })).toMatchInlineSnapshot(`"set terminal0 to focused terminal of (new tab in front window)"`);
  });

  it("split", () => {
    expect(stringOfGhosttyCommand({
      kind: "split", sourceIndex: 0, targetIndex: 1, direction: "right"
    })).toMatchInlineSnapshot(`"set terminal1 to split terminal0 direction right"`);
  });

  it("input-text", () => {
    expect(stringOfGhosttyCommand({
      kind: "input-text", terminalIndex: 0, text: "nvim src/foo.ts"
    })).toMatchInlineSnapshot(`"input text "nvim src/foo.ts" to terminal0"`);
  });

  it("send-key", () => {
    expect(stringOfGhosttyCommand({
      kind: "send-key", terminalIndex: 0, key: "enter"
    })).toMatchInlineSnapshot(`"send key "enter" to terminal0"`);
  });
});
