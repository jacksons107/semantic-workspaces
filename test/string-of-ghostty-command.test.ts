import { describe, it, expect } from "vitest";
import { stringOfGhosttyCommand } from "../src/backends/ghostty/string-of-ghostty-command";

describe("stringOfGhosttyCommand", () => {
  it("new-tab", () => {
    expect(stringOfGhosttyCommand({
      kind: "new-tab", localIndex: 0
    })).toMatchInlineSnapshot(`"set terminal0 to focused terminal of (new tab in front window)"`);
  });

  it("split from a terminal created earlier in the same script", () => {
    expect(stringOfGhosttyCommand({
      kind: "split", source: { kind: "new", localIndex: 0 }, targetLocalIndex: 1, direction: "right"
    })).toMatchInlineSnapshot(`"set terminal1 to split terminal0 direction right"`);
  });

  it("split from a terminal created in a previous run", () => {
    expect(stringOfGhosttyCommand({
      kind: "split", source: { kind: "existing", id: "ABC-123" }, targetLocalIndex: 0, direction: "down"
    })).toMatchInlineSnapshot(`"set terminal0 to split terminal id "ABC-123" of front window direction down"`);
  });

  it("input-text to a terminal created earlier in the same script", () => {
    expect(stringOfGhosttyCommand({
      kind: "input-text", terminal: { kind: "new", localIndex: 0 }, text: "nvim src/foo.ts"
    })).toMatchInlineSnapshot(`"input text "nvim src/foo.ts" to terminal0"`);
  });

  it("input-text to a terminal from a previous run", () => {
    expect(stringOfGhosttyCommand({
      kind: "input-text", terminal: { kind: "existing", id: "ABC-123" }, text: "nvim src/foo.ts"
    })).toMatchInlineSnapshot(`"input text "nvim src/foo.ts" to terminal id "ABC-123" of front window"`);
  });

  it("send-key to a terminal created earlier in the same script", () => {
    expect(stringOfGhosttyCommand({
      kind: "send-key", terminal: { kind: "new", localIndex: 0 }, key: "enter"
    })).toMatchInlineSnapshot(`"send key "enter" to terminal0"`);
  });
});
