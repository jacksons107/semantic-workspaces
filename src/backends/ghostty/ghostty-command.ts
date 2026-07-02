/**
 * Each terminal created within a single script is captured into its own AppleScript variable
 * (terminal0, terminal1, ...) and every later command in that same script
 * addresses its target terminal explicitly by that variable.
 *
 * Each `osascript` invocation is a fresh process, so local variables like
 * `terminal0` do not survive across separate runs — reconnecting to a
 * terminal created by a *previous* run instead requires the terminal's
 * stable `id` property. A GhosttyTerminalRef captures this distinction: "new" refers to a
 * variable set earlier in the *same* script, "existing" refers to a
 * terminal from a prior run by persisted id.
 *
 * Input text pastes text into the terminal but does not submit it (bracketed
 * paste keeps the newline as literal data), so every input-text command must
 * be followed by a send-key "enter" to actually run it.
 *
 * Each Workspace becomes a tab. Each Resource in the workspace becomes a
 * terminal within that tab: the first resource is the tab's initial
 * terminal, and later resources are created via `split` of an earlier
 * terminal (which may be new-in-this-script or existing-from-a-prior-run).
 *
 * Note: tab/terminal `name` is a read-only property in the sdef, so there
 * is no way to set a custom tab title — `new-tab` therefore carries no
 * title field.
 */

export type GhosttySplitDirection = "right" | "left" | "down" | "up";

export type GhosttyTerminalRef =
  | { kind: "new"; localIndex: number }
  | { kind: "existing"; id: string }

export type GhosttyCommand =
  | { kind: "new-tab"; localIndex: number }
  | { kind: "split"; source: GhosttyTerminalRef; targetLocalIndex: number; direction: GhosttySplitDirection }
  | { kind: "input-text"; terminal: GhosttyTerminalRef; text: string }
  | { kind: "send-key"; terminal: GhosttyTerminalRef; key: string }
