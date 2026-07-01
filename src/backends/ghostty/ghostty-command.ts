/**
 * Ghostty's AppleScript API (see Ghostty.sdef, e.g. via
 * `plutil -extract OSAScriptingDefinition xml1 -o - .../Ghostty.app/Contents/Info.plist`
 * to find it, then read the .sdef XML directly) exposes a hierarchy of
 * application -> windows -> tabs -> terminals.
 *
 * Working AppleScript, confirmed against Ghostty.sdef:
 *
 * tell application "Ghostty"
 *     set terminal0 to focused terminal of (new tab in front window)
 *     input text "pwd" to terminal0
 *     send key "enter" to terminal0
 *     set terminal1 to split terminal0 direction right
 * end tell
 *
 * input text, send key, and split all take a terminal *specifier* as their
 * target — they do not require operating on "whatever is currently
 * focused". So rather than relying on focus state (which does not
 * necessarily follow a freshly created split), each terminal a workspace
 * creates is captured into its own AppleScript variable at creation time
 * (terminal0, terminal1, ...) and every later command addresses its target
 * terminal explicitly by that variable, mirroring how tmux addresses panes
 * by index (`session:pane`) instead of "the active pane".
 *
 * input text pastes text into the terminal but does not submit it (bracketed
 * paste keeps the newline as literal data), so every input-text command must
 * be followed by a send-key "enter" to actually run it.
 *
 * Each Workspace becomes a tab. Each Resource in the workspace becomes a
 * terminal within that tab: the first resource is the tab's initial
 * terminal (terminal0), and later resources are created via `split` of an
 * earlier terminal.
 *
 * Note: tab/terminal `name` is a read-only property in the sdef, so there
 * is no way to set a custom tab title — `new-tab` therefore carries no
 * title field.
 */

export type GhosttySplitDirection = "right" | "left" | "down" | "up";

export type GhosttyCommand =
  | { kind: "new-tab"; terminalIndex: number }
  | { kind: "split"; sourceIndex: number; targetIndex: number; direction: GhosttySplitDirection }
  | { kind: "input-text"; terminalIndex: number; text: string }
  | { kind: "send-key"; terminalIndex: number; key: string }
