import { describe, it, expect } from "vitest";
import { bashCommandOfResource } from "../src/backends/bash-command-of-resource";

describe("bashCommandOfResource", () => {
  it("editor", () => {
    expect(bashCommandOfResource({ kind: "editor", name: "e1", file: "src/foo.ts" }))
      .toMatchInlineSnapshot(`"nvim src/foo.ts"`);
  });

  it("repl", () => {
    expect(bashCommandOfResource({ kind: "repl", name: "r1", language: "python" }))
      .toMatchInlineSnapshot(`"python3"`);
  });

  it("agent", () => {
    expect(bashCommandOfResource({ kind: "agent", name: "a1", agent: "claude" }))
      .toMatchInlineSnapshot(`"claude"`);
  });

  describe("diff", () => {
    it("no ref, no paths", () => {
      expect(bashCommandOfResource({ kind: "diff", name: "d1", ref: "", paths: [] }))
        .toMatchInlineSnapshot(`"git diff | delta"`);
    });

    it("ref only", () => {
      expect(bashCommandOfResource({ kind: "diff", name: "d1", ref: "main", paths: [] }))
        .toMatchInlineSnapshot(`"git diff main | delta"`);
    });

    it("paths only", () => {
      expect(bashCommandOfResource({ kind: "diff", name: "d1", ref: "", paths: ["src/foo.ts", "src/bar.ts"] }))
        .toMatchInlineSnapshot(`"git diff -- src/foo.ts src/bar.ts | delta"`);
    });

    it("ref and paths", () => {
      expect(bashCommandOfResource({ kind: "diff", name: "d1", ref: "HEAD~3", paths: ["src/foo.ts"] }))
        .toMatchInlineSnapshot(`"git diff HEAD~3 -- src/foo.ts | delta"`);
    });
  });
});
