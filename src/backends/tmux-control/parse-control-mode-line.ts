export type ControlModeEvent =
  | { kind: "begin"; timestamp: string; commandNumber: string }
  | { kind: "end"; timestamp: string; commandNumber: string }
  | { kind: "error"; timestamp: string; commandNumber: string }
  | { kind: "notification"; name: string; args: string[] }
  | { kind: "output-line"; text: string };

export function parseControlModeLine(line: string): ControlModeEvent {
  if (!line.startsWith("%")) {
    return { kind: "output-line", text: line };
  }

  const [tag, ...rest] = line.slice(1).split(" ");
  const timestamp = rest[0] ?? "";
  const commandNumber = rest[1] ?? "";

  switch (tag) {
    case "begin":
      return { kind: "begin", timestamp, commandNumber };
    case "end":
      return { kind: "end", timestamp, commandNumber };
    case "error":
      return { kind: "error", timestamp, commandNumber };
    default:
      return { kind: "notification", name: tag ?? "", args: rest };
  }
}
