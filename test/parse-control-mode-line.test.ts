import { describe, it, expect } from "vitest";
import { parseControlModeLine } from "../src/backends/tmux-control/parse-control-mode-line";

describe("parseControlModeLine", () => {
  it("%begin", () => {
    expect(parseControlModeLine("%begin 1234567890 1 1")).toMatchInlineSnapshot(`
      {
        "commandNumber": "1",
        "kind": "begin",
        "timestamp": "1234567890",
      }
    `);
  });

  it("%end", () => {
    expect(parseControlModeLine("%end 1234567890 1 1")).toMatchInlineSnapshot(`
      {
        "commandNumber": "1",
        "kind": "end",
        "timestamp": "1234567890",
      }
    `);
  });

  it("%error", () => {
    expect(parseControlModeLine("%error 1234567890 1 1")).toMatchInlineSnapshot(`
      {
        "commandNumber": "1",
        "kind": "error",
        "timestamp": "1234567890",
      }
    `);
  });

  it("notification", () => {
    expect(parseControlModeLine("%exit")).toMatchInlineSnapshot(`
      {
        "args": [],
        "kind": "notification",
        "name": "exit",
      }
    `);
  });

  it("notification with args", () => {
    expect(parseControlModeLine("%window-add @1")).toMatchInlineSnapshot(`
      {
        "args": [
          "@1",
        ],
        "kind": "notification",
        "name": "window-add",
      }
    `);
  });

  it("plain reply line", () => {
    expect(parseControlModeLine("0: 1 windows (created Mon Jan  1 00:00:00 2026)")).toMatchInlineSnapshot(`
      {
        "kind": "output-line",
        "text": "0: 1 windows (created Mon Jan  1 00:00:00 2026)",
      }
    `);
  });
});
